import { Router } from 'express';
import MeetAndGreetsController from '@controllers/meetAndGreet.controller';
import { SignUpMeetAndGreetsDto, BuyTicketDto } from '@dtos/meetAndGreets.dto';
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

    this.router.post(
      `${this.path}/signup`,
      authMiddleware,
      modelMiddleware,
      validationMiddleware(SignUpMeetAndGreetsDto, 'body'),
      this.meetAndGreetsController.signup,
    );

    //get-model
    this.router.get(`${this.path}/get-model/:id`, authMiddleware, this.meetAndGreetsController.getModelMeetAndGreets);

    //buy ticket for meet and greet
    this.router.post(`${this.path}/buy-ticket`, authMiddleware, validationMiddleware(BuyTicketDto, 'body'), this.meetAndGreetsController.buyTicket);
  }
}

export default MeetAndGreetRoute;
