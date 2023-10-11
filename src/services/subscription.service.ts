import { HttpException } from '@exceptions/HttpException';
import { Subscription } from '@interfaces/subscription.interface';
import { Plan } from '@interfaces/plan.interface';
import { MakeSubscriptionDto } from '@dtos/subscription.dto';
import SubscriptionModel from '@/models/subscriptions.model';
import TransactionModel from '@/models/transactions.model';
import PlanModel from '@models/plans.model';
import { isEmpty } from '@utils/util';
import moment from 'moment';

class SubscriptionService {
  public subscription = SubscriptionModel;
  public plans = PlanModel;
  public transactions = TransactionModel;

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
  public async update(
    duration: any,
    subscriptionData: MakeSubscriptionDto,
  ): Promise<Subscription> {
    if (isEmpty(subscriptionData)) throw new HttpException(400, 'Subscription is required.');
    // if (isEmpty(status)) throw new HttpException(400, 'Plan is required.');
    // if (isEmpty(duration)) throw new HttpException(400, 'Duration is required.');

    let setObject = {};
    if (subscriptionData?.status != null && subscriptionData?.status != '') {
      setObject['status'] = subscriptionData?.status;

      if (subscriptionData?.status == 'active') {
        if (duration != null) {
          let purchaseDate = moment();
          let expiryDate = moment().add(duration, 'months');
          setObject['purchasedate'] = purchaseDate;
          setObject['expirydate'] = expiryDate;
        }
      }
    }
    if (subscriptionData?.planId != null && subscriptionData?.planId != "") {
      const getPlan: Plan = await this.plans.findOne({
        _id: subscriptionData?.planId,
      });
      if (getPlan == null) throw new HttpException(400, 'Plan not found.');
      setObject['planId'] = subscriptionData?.planId;
    }
    setObject['updated_at'] = moment();
    const createData: any = await this.subscription.findOneAndUpdate(
      { _id: subscriptionData?.subscriptionId },
      {
        $set: setObject,
      },
    );

    if (subscriptionData?.response != null)  {
      let trans = {
        response: JSON.stringify(subscriptionData?.response),
        userId: createData._doc.userId.toString(),
        planId: createData._doc.planId.toString(),
        subscriptionId: createData._doc._id.toString(),
        created_at: moment(),
        updated_at: moment(),
      };

      if (subscriptionData?.address != null && subscriptionData?.address != "") {
        trans['address'] = subscriptionData?.address;
      } 
      if (subscriptionData?.cardname != null && subscriptionData?.cardname != '') {
        trans['cardname'] = subscriptionData?.cardname;
      } 

      const updateTransaction = await this.transactions.create(trans);
    }
    return createData;
  }
}

export default SubscriptionService;
