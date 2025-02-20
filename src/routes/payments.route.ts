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
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/processPayment`,
      authMiddleware,
      validationMiddleware(ProcessPaymentDto, 'body'),
      this.paymentController.processPayment,
    );
    this.router.get(`${this.path}/sendStripeApiKey`, authMiddleware, this.paymentController.sendStripeApiKey);

    //get all cards
    this.router.get(`${this.path}/getCards`, authMiddleware, this.paymentController.getCards);
  }
}

export default PaymentsRoute;
