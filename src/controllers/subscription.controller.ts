import { NextFunction, Request, Response } from 'express';
import { Subscription } from '@interfaces/subscription.interface';
import { Plan } from '@interfaces/plan.interface';
import { MakeSubscriptionDto } from '@dtos/subscription.dto';
import SubscriptionService from '@services/subscription.service';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';

class SubscriptionController {
  public subscriptionService = new SubscriptionService();

  public getSubscription = async (req: any, res: Response, next: NextFunction) => {
    try {
      const findPlan: Plan = await this.subscriptionService.getPlanWithId(req.params.planId, req.user.type);

      if (findPlan == null) {
        throw new HttpException(404, `Plan not found.`);
      }
      console.log(req.user._id.toString());
      const getSubscription: Subscription = await this.subscriptionService.create(req.params.planId, req.user._id.toString());
      res.status(200).json({ data: getSubscription, message: 'Get Subscription Id' });
    } catch (error) {
      next(error);
    }
  };

  public makeSubscription = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const subscriptionData: MakeSubscriptionDto = req.body;
      console.log(req.user._id.toString(), 'user id');
      const userId = req.user._id.toString();
      const subData: Subscription = await this.subscriptionService.create(subscriptionData.planId, userId);
      res.status(201).json({ data: subData, message: 'subscription created', status: true });
    } catch (error) {
      next(error);
    }
  };
}

export default SubscriptionController;
