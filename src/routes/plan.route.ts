import { Router } from 'express';
import PlansController from '@controllers/plan.controller';
import { CreatePlansDto, GetPlansDto, paramIdDto } from '@dtos/plans.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class PlanRoute implements Routes {
  public path = '/plans';
  public router = Router();
  public plansController = new PlansController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:type`, validationMiddleware(GetPlansDto, 'params'), this.plansController.getPlans);
    this.router.post(`${this.path}/create`, authMiddleware, validationMiddleware(CreatePlansDto, 'body'), this.plansController.create);
    this.router.get(`${this.path}/get-details/:planId`, validationMiddleware(paramIdDto, 'params'), this.plansController.getPlanById);
  }
}

export default PlanRoute;
