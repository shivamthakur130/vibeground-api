import { Router } from 'express';
import MeetAndGreetsController from '@controllers/meetAndGreet.controller';
import { SignUpMeetAndGreetsDto } from '@dtos/meetAndGreets.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import modelMiddleware from '@middlewares/model.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class MeetAndGreetRoute implements Routes {
  public path = '/meet-and-greet';
  public router = Router();
  public meetAndGreetsController = new MeetAndGreetsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, authMiddleware, modelMiddleware, this.meetAndGreetsController.getMeetAndGreetByUserId);
    // this.router.get(`${this.path}/get-details/:planId`, validationMiddleware(paramIdDto, 'params'), this.plansController.getPlanById);

    this.router.post(
      `${this.path}/signup`,
      authMiddleware,
      modelMiddleware,
      validationMiddleware(SignUpMeetAndGreetsDto, 'body'),
      this.meetAndGreetsController.signup,
    );

    // this.router.put(`${this.path}/update/:planId`, authMiddleware, validationMiddleware(UpdatePlansDto, 'body'), this.plansController.update);
    // this.router.delete(`${this.path}/delete/:planId`, authMiddleware, validationMiddleware(paramIdDto, 'params'), this.plansController.delete);
  }
}

export default MeetAndGreetRoute;
