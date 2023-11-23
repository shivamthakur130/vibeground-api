import { NextFunction, Request, Response } from 'express';
import { Subscription } from '@interfaces/subscription.interface';
import { Plan } from '@interfaces/plan.interface';
import { MakeSubscriptionDto } from '@dtos/subscription.dto';
import SubscriptionService from '@services/subscription.service';
import AuthService from '@/services/auth.service';
import { HttpException } from '@exceptions/HttpException';

class SubscriptionController {
  public subscriptionService = new SubscriptionService();
  public authService = new AuthService();

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

  public makeSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptionData: MakeSubscriptionDto = req.body;

      //check if user has subscription
      const userId = subscriptionData.userId;
      if (req.body?.subscriptionId != null && req.body?.subscriptionId != '') {
        //find subscription update subscription
        const subscriptionDataGet: any = await this.subscriptionService.findById(req.body?.subscriptionId, userId);
        console.log(subscriptionDataGet, 'subscriptionDataGet');
        if (subscriptionDataGet == null) {
          throw new HttpException(404, `Subscription not found.`);
        }
        if (req.body?.status == 'succeeded') {
          //check the duration is available or not
          const duration = subscriptionDataGet?._doc?.planId?.duration != null ? subscriptionDataGet?._doc?.planId?.duration : 0;

          //fetch the subscription data and update base on data given
          const subData: Subscription = await this.subscriptionService.update(duration, subscriptionData);

          const subscriptionDetails = await this.subscriptionService.findById(req.body?.subscriptionId, userId);

          // return plan data as well
          const planData: Plan = await this.subscriptionService.getPlanDetails(subscriptionData.planId);

          const userData = {
            userId: userId,
            status: 'active',
          };

          // update user status
          await this.authService.UpdateUserDetails(userId, userData);

          const subDetails = {
            ...subData._doc,
            planDetails: planData,
            subscriptionDetails,
          };

          res.status(201).json({ data: subDetails, message: 'subscription created successfully', status: true });
        } else {
          console.log('payment failed');
          //update plan id and status
          const subData: Subscription = await this.subscriptionService.update(0, subscriptionData);

          //if payment failed
          const userData = {
            userId: userId,
            status: 'inactive',
          };

          const planData: Plan = await this.subscriptionService.getPlanDetails(subscriptionData.planId);

          console.log(planData, 'planData');

          const subDetails = {
            ...subData._doc,
            planDetails: planData,
          };

          // update user status
          await this.authService.UpdateUserDetails(userId, userData);

          res.status(201).json({ data: subDetails, message: 'subscription created successfully', status: true });
        }
      } else {
        // if no subscription create new
        const subData: Subscription = await this.subscriptionService.create(subscriptionData.planId, userId);
        // return plan data as well
        const planData: Plan = await this.subscriptionService.getPlanDetails(subscriptionData.planId);
        console.log(planData, 'planData');
        const subDetails = {
          ...subData._doc,
          planDetails: planData,
        };
        res.status(201).json({ data: subDetails, message: 'subscription created successfully', status: true });
      }
    } catch (error) {
      console.log(error, 'error');
      next(error);
    }
  };
}

export default SubscriptionController;
