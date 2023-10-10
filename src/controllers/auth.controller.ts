import { NextFunction, Request, Response } from 'express';
import {
  CreateUserDto,
  FanEmailDto,
  FanDetailsDto,
  FanPasswordDto,
  FanDateofBirthDto,
  FanGenderDto,
  FanLocationDto,
  ModelDetailsDto,
  ModelAboutDto,
  ModelPassPortDto,
  ModelDOBDto,
  ModelPhotosDto,
} from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { HttpException } from '@exceptions/HttpException';

class AuthController {
  public authService = new AuthService();

  // Model
  public ModelDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: ModelDetailsDto = req.body;
      // passwrod validation
      if (userData.password.length < 8) {
        throw new HttpException(400, `password must be at least 8 characters.`);
      } else if (!userData.password.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/)) {
        throw new HttpException(400, `password must contain at least 1 letter, 1 number and 1 one of the characters #,$,%,&,!.`);
      }
      const signUpUserData: User = await this.authService.ModelDetails(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  public ModelAbout = async (req: Request, res: Response, next: NextFunction) => {
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
  public ModelPhotos = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userData: ModelPhotosDto = req.body;

      const user: User = await this.authService.findUserByIdWithType(userData.userId, 'model');

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }
      const photos: string[] = [];
      if (req?.files != null && req?.files.length > 0) {
        for (let i = 0; i < req?.files.length; i++) {
          const obj = req?.files[i];
          if (obj?.path != null && obj?.path != '') {
            photos.push(obj?.path);
          }
        }
        userData.photos = photos;
        const signUpUserData: User = await this.authService.ModelPhotos(userData);
        delete signUpUserData.password;
        res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
      } else {
        throw new HttpException(404, `Atleast one image is required.`);
      }
    } catch (error) {
      next(error);
    }
  };

  // Fan
  //**--- Step - 1 */
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
  public FanPasword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanPasswordDto = req.body;

      // passwrod validation
      if (userData.password.length < 8) {
        throw new HttpException(400, `password must be at least 8 characters.`);
      } else if (!userData.password.match(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/)) {
        throw new HttpException(400, `password must contain at least 1 letter, 1 number and 1 one of the characters #,$,%,&,!.`);
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
  public FanDateofBirth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanDateofBirthDto = req.body;
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
      const { cookie, findUser } = await this.authService.login(userData);

      console.log('test');
      console.log(cookie, findUser);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
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
}

export default AuthController;
