import { NextFunction, Request, Response } from 'express';
import {
  CreateUserDto,
  FanEmailDto,
  FanDetailsDto,
  FanPasswordDto,
  ForgotPasswordDto,
  FanDateOfBirthDto,
  FanGenderDto,
  FanLocationDto,
  ModelDetailsDto,
  ModelAboutDto,
  ModelPassPortDto,
  ModelDOBDto,
  ModelCategoriesDto,
  ModelPhotosDto,
  ModelLinksDto,
  ModelVideoDto,
  GoogleLogin,
} from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import EmailService from '@services/email.service';
import { HttpException } from '@exceptions/HttpException';
import { FRONTEND_URL } from '@config';

class AuthController {
  public authService = new AuthService();
  public emailService = new EmailService();

  // Model
  //**--- Step - 1 */
  public ModelDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ModelDetailsDto = req.body;
      console.log('userData', userData);
      // password validation
      if (userData.password.length < 8) {
        throw new HttpException(400, `password must be at least 8 characters.`);
      } else if (!userData.password.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#$%&? "]).*$/)) {
        throw new HttpException(400, `password must contain at least 1 letter, 1 number and 1 one of the characters @,#,$,%,&,!.`);
      }
      const signUpUserData: User = await this.authService.ModelDetails(userData);
      res.status(201).json({ data: signUpUserData, message: 'Model details updated successfully.', status: true });
    } catch (error) {
      next(error);
    }
  };
  //**--- Step - 2 */
  public ModelAbout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: ModelAboutDto = req.body;
      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');
      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const signUpUserData: User = await this.authService.ModelAbout(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 3 */
  public ModelDateOfBirth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ModelDOBDto = req.body;
      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const signUpUserData: User = await this.authService.ModelDateofBirth(userData);
      delete signUpUserData.password;
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };
  //**--- Step - 4 */
  public ModelPassPort = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userData: ModelPassPortDto = req.body;

      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }

      let front = false;
      let back = false;
      if (req?.files != null) {
        if (req?.files?.passport_front != null && req?.files?.passport_front.length > 0) {
          const obj = req?.files?.passport_front[0];
          if (obj?.path != null && obj?.path != '') {
            userData.passport_front = obj?.path;
            front = true;
          }
        }
        if (req?.files?.passport_back != null && req?.files?.passport_back.length > 0) {
          const obj = req?.files?.passport_back[0];
          if (obj?.path != null && obj?.path != '') {
            userData.passport_back = obj?.path;
            back = true;
          }
        }
      }

      if (front == true && back == true) {
        const signUpUserData: User = await this.authService.ModelPassPort(userData);
        delete signUpUserData.password;
        res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
      } else {
        throw new HttpException(404, `Passport both side image is required.`);
      }
    } catch (error) {
      next(error);
    }
  };
  //**--- Step - 5 */
  public ModelPhotos = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userData: ModelPhotosDto = req.body;
      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const photos: string[] = [];
      const photosExisting: string[] = [];
      console.log(userData?.photosExisting, 'userData?.photosExisting');

      if (req?.files != null && req?.files.length > 0) {
        for (let i = 0; i < req?.files.length; i++) {
          const obj = req?.files[i];
          if (obj?.path != null && obj?.path != '') {
            photos.push(obj?.path);
          }
        }
        let j = 0;
        //check if photosExisting has value than add it to new photos array
        if (userData?.photosExisting != null && userData?.photosExisting.length > 0) {
          for (let i = 0; i < userData?.photosExisting.length; i++) {
            const obj = userData?.photosExisting[i];
            if (obj == 'new') {
              photosExisting[i] = photos[j];
              j++;
            } else if (obj != null && obj != '' && obj != 'new') {
              photosExisting.push(obj);
            }
          }
        }
        userData.photos = photosExisting;
        const signUpUserData: User = await this.authService.ModelPhotos(userData);
        delete signUpUserData.password;
        res.status(201).json({ data: signUpUserData, message: 'photos saved successfully.', status: true });
      } else {
        if (userData?.photosExisting != null && userData?.photosExisting.length > 0) {
          userData.photos = userData?.photosExisting;
          const signUpUserData: User = await this.authService.ModelPhotos(userData);
          delete signUpUserData.password;
          res.status(201).json({ data: signUpUserData, message: 'photos saved successfully.', status: true });
        } else {
          throw new HttpException(404, `At least one image is required.`);
        }
      }
    } catch (error) {
      next(error);
    }
  };
  //**--- Step - 6 */
  public ModelVideos = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userData: ModelVideoDto = req.body;

      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const videos: string[] = [];
      const videosExisting: string[] = [];
      if (req?.files != null && req?.files.length > 0) {
        for (let i = 0; i < req?.files.length; i++) {
          const obj = req?.files[i];
          if (obj?.path != null && obj?.path != '') {
            videos.push(obj?.path);
          }
        }

        let j = 0;
        //check if photosExisting has value than add it to new photos array
        if (userData?.videosExisting != null && userData?.videosExisting.length > 0) {
          for (let i = 0; i < userData?.videosExisting.length; i++) {
            const obj = userData?.videosExisting[i];
            if (obj == 'new') {
              videosExisting[i] = videos[j];
              j++;
            } else if (obj != null && obj != '' && obj != 'new') {
              videosExisting.push(obj);
            }
          }
        }

        userData.videos = videosExisting;
        const signUpUserData: User = await this.authService.ModelVideos(userData);
        delete signUpUserData.password;

        res.status(201).json({ data: signUpUserData, message: 'Videos saved successfully.', status: true });
      } else {
        console.log(videosExisting, 'videosExisting');
        if (userData?.videosExisting != null && userData?.videosExisting.length > 0) {
          userData.videos = userData?.videosExisting;
          const signUpUserData: User = await this.authService.ModelVideos(userData);
          delete signUpUserData.password;

          res.status(201).json({ data: signUpUserData, message: 'Videos saved successfully.', status: true });
        } else {
          throw new HttpException(404, `At least one image is required.`);
        }
      }
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 7 */
  public ModelLinks = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: ModelLinksDto = req.body;
      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const signUpUserData: User = await this.authService.ModelLinks(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 8 */
  public ModelCategories = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: ModelCategoriesDto = req.body;
      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const signUpUserData: User = await this.authService.ModelCategories(userData);
      res.status(201).json({ data: signUpUserData, message: 'Model category updated.', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 1 */
  // Fan
  public FanEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanEmailDto = req.body;
      const signUpUserData: User = await this.authService.FanEmail(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 2 */
  public FanDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanDetailsDto = req.body;
      // check User exists;
      const user: User = await this.authService.findUserById(userData.userId);

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }

      const signUpUserData: User = await this.authService.FanDetails(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 3 */
  public FanPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanPasswordDto = req.body;

      // password validation
      if (userData.password.length < 8) {
        throw new HttpException(400, `password must be at least 8 characters.`);
      } else if (!userData.password.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#$%&? "]).*$/)) {
        throw new HttpException(400, `password must contain at least 1 letter, 1 number and 1 one of the characters @,#,$,%,&,!.`);
      }

      // check User exists;
      const user: User = await this.authService.findUserById(userData.userId);

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }

      const signUpUserData: User = await this.authService.FanPassword(userData);

      delete signUpUserData.password;
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 4 */
  public FanDateOfBirth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanDateOfBirthDto = req.body;
      const signUpUserData: User = await this.authService.FanDateofBirth(userData);
      delete signUpUserData.password;
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 5 */
  public FanGender = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanGenderDto = req.body;
      const signUpUserData: User = await this.authService.FanGender(userData);
      delete signUpUserData.password;
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 6 */
  public FanLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanLocationDto = req.body;
      const signUpUserData: User = await this.authService.FanLocation(userData);
      delete signUpUserData.password;
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  // other

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const findUser = await this.authService.login(userData);

      if (findUser == null) {
        throw new HttpException(404, `User not found.`);
      }
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public query = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //send email to admin
      const userData: CreateUserDto = req.body;

      const htmlTemplate = `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Query from user</title>
      </head>
      <body>
          <div style="text-align: left; background-color: #f2f2f2; padding: 20px;">
              <h1>Hello Admin</h1>
              <p>Email : ${userData.email}</p>
              <p>Regards,<br/> Api Response</p>
          </div>
      </body>
      </html>`;

      const response = await this.emailService.sendEmail(userData.email, 'Query from user', htmlTemplate);

      res.status(200).json({ data: null, message: 'Sign up done successfully.', status: true });
    } catch (error) {
      next(error);
    }
  };

  //google
  public google = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: GoogleLogin = req.body;

      const user = await this.authService.findUserByGoogleId(userData.providerId);
      console.log(userData, user);
      if (user == null) {
        await this.authService.saveGoogleUser(userData);
      }
      // return res.status(200).json({ data: user, message: 'Google Login' });
      const prepareLogin = {
        email: userData.email,
        type: user?.type ?? 'fan',
        password: userData.providerId,
        operation: userData.provider,
      };
      const findUser = await this.authService.login(prepareLogin);

      if (findUser == null) {
        throw new HttpException(404, `User not found.`);
      }

      res.status(200).json({ data: findUser, message: 'Google Login', status: true });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const userId = userData._id;
      const findUser = await this.authService.me(userId);
      res.status(200).json({ data: findUser, message: 'me' });
    } catch (error) {
      next(error);
    }
  };

  public updateUserDetails = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const userId = userData._id;
      // console.log(req.body, 'req.body', userId);
      // check if email is already exists
      const user = await this.authService.findUserByEmail(req.body.email);
      // console.log(user, 'user', userId);
      if (user != null && user._id != req.body.userId) {
        throw new HttpException(400, `Email already exists.`);
      }
      const findUser = await this.authService.UpdateUserDetails(userId, req.body);
      res.status(200).json({ data: findUser, message: 'User details updated successfully.', status: true });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const userId = userData._id;
      console.log(req.body, 'req.body', userId);
      //compare old password and user
      const user = await this.authService.comparePassword(req.body, userId);
      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }

      // password validation
      if (req.body.password.length < 8) {
        throw new HttpException(400, `password must be at least 8 characters.`);
      } else if (!req.body.password.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@!#$%&? "]).*$/)) {
        throw new HttpException(400, `password must contain at least 1 letter, 1 number and 1 one of the characters @,#,$,%,&,!.`);
      }

      const userDetails: User = await this.authService.changePassword(userId, req.body);
      res.status(201).json({ data: userDetails, message: 'Password changed successfully.', status: true });
    } catch (error) {
      next(error);
    }
  };

  //forgotPassword
  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanEmailDto = req.body;
      const user = await this.authService.findUserByEmail(userData.email);
      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const userId = Buffer.from(user._id).toString('base64');

      const htmlTemplate = `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Forgot Password</title>
      </head>
      <body>
          <div style="text-align: left; background-color: #f2f2f2; padding: 20px;">
              <h1>Hello ${user.firstName + ' ' + user.lastName}</h1>
              <p>Click on the below link to reset your password.</p>
              <p><a href="${FRONTEND_URL}/login/reset-password/${userId}">Reset Password</a></p>
              <p>Regards,<br/>
              VibeGround Team
              </p>
          </div>
      </body>
      </html>`;
      const response = await this.emailService.sendEmail(userData.email, 'Forgot Password', htmlTemplate);
      res.status(200).json({ data: null, message: 'Email sent successfully.', status: true });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ForgotPasswordDto = req.body;
      const userId = Buffer.from(userData.token, 'base64').toString('ascii');
      const user = await this.authService.findUserById(userId);
      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const signUpUserData: User = await this.authService.resetPassword(user.email, userData.password);
      res.status(201).json({ data: signUpUserData, message: 'Password reset successfully.', status: true });
    } catch (error) {
      next(error);
    }
  };

  // public getAuthenticatedClient = async () => {
  //   const oAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET, 'postmessage');

  // };
}

export default AuthController;
