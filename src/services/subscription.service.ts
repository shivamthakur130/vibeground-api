import { HttpException } from '@exceptions/HttpException';
import { Subscription } from '@interfaces/subscription.interface';
import { Plan } from '@interfaces/plan.interface';
import SubscriptionModel from '@/models/subscriptions.model';
import PlanModel from '@models/plans.model';
import { isEmpty } from '@utils/util';

class SubscriptionService {
  public subscription = SubscriptionModel;
  public plans = PlanModel;

  public async getPlanWithId(planId: string, type: string): Promise<Plan> {
    const plans: Plan = await this.plans.findOne({ _id: planId, type: type });
    return plans;
  }

  public async create(planId: string, userId: string): Promise<Subscription> {
    if (isEmpty(planId)) throw new HttpException(400, 'Plan is required.');
    if (isEmpty(userId)) throw new HttpException(400, 'User is required.');

    const createData: Subscription = await this.subscription.create({ userId: userId, planId: planId });
    return createData;
  }
}

export default SubscriptionService;
