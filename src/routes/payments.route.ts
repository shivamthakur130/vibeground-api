import { Router } from 'express';
import PaymentsController from '@controllers/payments.controller';
import { ProcessPaymentDto } from '@dtos/payments.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class PaymentsRoute implements Routes {
  public path = '/payments';
  public router = Router();
  public paymentController = new PaymentsController();

  constructor() {
    this.router.use(authMiddleware);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/processPayment`, validationMiddleware(ProcessPaymentDto, 'body'), this.paymentController.processPayment);
    this.router.get(`${this.path}/sendStripeApiKey`, this.paymentController.sendStripeApiKey);
  }
}

export default PaymentsRoute;
