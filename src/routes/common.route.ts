import { Router } from 'express';
import CommonController from '@controllers/common.controller';
import { GetCitiesDto } from '@dtos/common.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class CommonRoute implements Routes {
  public path = '/';
  public router = Router();
  public commonController = new CommonController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}cities/:countryCode`, validationMiddleware(GetCitiesDto, 'params'), this.commonController.getCities);
  }
}

export default CommonRoute;
