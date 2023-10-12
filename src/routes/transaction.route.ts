import { Router } from 'express';
import TransactionController from '@controllers/transaction.controller';
import { GetPlansDto } from '@dtos/transaction.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class TransactionRoute implements Routes {
  public path = '/transaction';
  public router = Router();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:planid`, authMiddleware, validationMiddleware(GetPlansDto, 'params'), this.transactionController.getTransaction);
  }
}

export default TransactionRoute;
