import { Router } from 'express';
import SubscriptionController from '@controllers/subscription.controller';
import { GetPlansDto } from '@dtos/plans.dto';
import { MakeSubscriptionDto } from '@dtos/subscription.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class SubscriptionRoute implements Routes {
  public path = '/subscription';
  public router = Router();
  public subscriptionController = new SubscriptionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:planId`, validationMiddleware(GetPlansDto, 'params'), this.subscriptionController.getSubscription);
    //make
    this.router.post(`${this.path}/make`, validationMiddleware(MakeSubscriptionDto, 'body'), this.subscriptionController.makeSubscription);
  }
}

export default SubscriptionRoute;
