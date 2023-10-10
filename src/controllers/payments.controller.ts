import { NextFunction, Request, Response } from 'express';
import { ProcessPaymentDto } from '@dtos/payments.dto';
import { Plan } from '@interfaces/plan.interface';
import { User } from '@interfaces/users.interface';
import PaymentService from '@services/payment.service';
import { HttpException } from '@exceptions/HttpException';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_API_KEY } from '@config';

class PaymentsController {
  public paymentService = new PaymentService();

  public processPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const planData: ProcessPaymentDto = req.body;

      // check User
      const findUser: User = await this.paymentService.findUser(planData.userid);

      if (findUser == null) throw new HttpException(404, `User not found.`);

      // check Plan

      const findPlan: Plan = await this.paymentService.findPlan(planData.planid, findUser.type);

      if (findPlan == null) throw new HttpException(404, `Plan not found.`);
      let stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' } as Stripe.StripeConfig);
      const myPayment = await stripe.paymentIntents.create({
        amount: findPlan.price,
        currency: 'CHF',
        metadata: {
          company: 'Vibe Ground!',
        },
        // automatic_payment_methods: {
        //   enabled: true,
        // },
        // payment_method_types: ['card'],
        // payment_method_types: ['card', 'google_pay', 'apple_pay', 'sepa_debit'],
      });
      res.status(200).json({
        data: {
          client_secret: myPayment.client_secret,
        },
        message: 'Payment Process Init',
      });
    } catch (error) {
      next(error);
    }
  };

  public sendStripeApiKey  = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
          data: {
            api_key: STRIPE_API_KEY,
          },
          message: 'Api key Get Successfully',
        });
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentsController;
