import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto, FanStep1Dto, FanStep2Dto, FanStep3Dto, FanStep4Dto, FanStep5Dto, FanStep6Dto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Fan
    this.router.post(`${this.path}fan/register1`, validationMiddleware(FanStep1Dto, 'body'), this.authController.fanstep1);
    this.router.post(`${this.path}fan/register2`, validationMiddleware(FanStep2Dto, 'body'), this.authController.fanstep2);
    this.router.post(`${this.path}fan/register3`, validationMiddleware(FanStep3Dto, 'body'), this.
    authController.fanstep3);
    this.router.post(`${this.path}fan/register4`, validationMiddleware(FanStep4Dto, 'body'), this.
    authController.fanstep4);
    this.router.post(`${this.path}fan/register5`, validationMiddleware(FanStep5Dto, 'body'), this.
    authController.fanstep5);
    this.router.post(`${this.path}fan/register6`, validationMiddleware(FanStep6Dto, 'body'), this.authController.fanstep6);

    // other
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
