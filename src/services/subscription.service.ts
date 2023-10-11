import { HttpException } from '@exceptions/HttpException';
import { Subscription } from '@interfaces/subscription.interface';
import { Plan } from '@interfaces/plan.interface';
import SubscriptionModel from '@/models/subscriptions.model';
import PlanModel from '@models/plans.model';
import { isEmpty } from '@utils/util';
import moment from 'moment';

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
  public async findById(subscriptionId: string, userId: string): Promise<any> {
    const data: any = await this.subscription.findOne({ _id: subscriptionId, userId: userId }).populate('planId');
    return data;
  }
  public async update(subscriptionId: string, status: string,duration: any): Promise<Subscription> {
    
    if (isEmpty(subscriptionId)) throw new HttpException(400, 'Subscriptino Id is required.');
    if (isEmpty(status)) throw new HttpException(400, 'Plan is required.');
    if (isEmpty(duration)) throw new HttpException(400, 'Duration is required.');

    let purchaseDate = moment();
    let expiryDate = moment().add(duration, 'months');

    let setObject = {
      status: status
    }
    if(status == "active") {
      setObject['purchasedate'] = purchaseDate;
      setObject['expirydate'] = expiryDate;
      setObject['updated_at'] = moment();
    }
    const createData: Subscription = await this.subscription.findOneAndUpdate(
      { _id: subscriptionId },
      {
        $set: setObject,
      },
    );
    return createData;
  }
}

export default SubscriptionService;
