import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, FanStep1Dto, FanStep2Dto, FanStep3Dto, FanStep4Dto, FanStep5Dto, FanStep6Dto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { HttpException } from '@exceptions/HttpException';

class AuthController {
  public authService = new AuthService();

  // Fan
  //**--- Step - 1 */
  public fanstep1 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanStep1Dto = req.body;
      const signUpUserData: User = await this.authService.FanSetp1(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 2 */
  public fanstep2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanStep2Dto = req.body;
      // check User exists;
      const user: User = await this.authService.findUserById(userData.userId);

      if (user == null) {
        throw new HttpException(404, `User not found.`);
      }

      const signUpUserData: User = await this.authService.FanSetp2(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 3 */
  public fanstep3 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanStep3Dto = req.body;

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

      const signUpUserData: User = await this.authService.FanSetp3(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 4 */
  public fanstep4 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanStep4Dto = req.body;
      const signUpUserData: User = await this.authService.FanSetp4(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 5 */
  public fanstep5 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanStep5Dto = req.body;
      const signUpUserData: User = await this.authService.FanSetp5(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup', status: true });
    } catch (error) {
      next(error);
    }
  };

  //**--- Step - 6 */
  public fanstep6 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: FanStep6Dto = req.body;
      const signUpUserData: User = await this.authService.FanSetp6(userData);
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
