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

  public async getPlanDetails(planId: string): Promise<Plan> {
    const plans: Plan = await this.plans.findOne({ _id: planId });
    return plans;
  }

  public async create(planId: string, userId: string): Promise<Subscription> {
    if (isEmpty(planId)) throw new HttpException(400, 'Plan id is required.');
    if (isEmpty(userId)) throw new HttpException(400, 'User id is required.');

    const createData: Subscription = await this.subscription.create({ userId: userId, planId: planId });
    return createData;
  }
  public async findById(subscriptionId: string, userId: string): Promise<any> {
    const data: any = await this.subscription.findOne({ _id: subscriptionId, userId: userId }).populate('planId');
    return data;
  }
  public async update(duration: any, subscriptionData: MakeSubscriptionDto): Promise<Subscription> {
    try {
      if (isEmpty(subscriptionData)) throw new HttpException(400, 'Subscription is required.');
      if (isEmpty(subscriptionData.planId)) throw new HttpException(400, 'Plan is required.');
      // if (isEmpty(duration)) throw new HttpException(400, 'Duration is required.');

      let trans = {};
      const setObject = {};

      //check subscription status available or not  if it's available then update check the payment status is succeeded or not
      if (subscriptionData?.status != null && subscriptionData?.status != '') {
        if (subscriptionData?.status == 'succeeded') {
          console.log(duration, 'duration');
          setObject['status'] = 'active';

          // update expiry date and purchase date
          if (duration != null) {
            const purchaseDate = moment();
            const expiryDate = moment().add(duration, 'months');
            setObject['purchase_date'] = purchaseDate;
            setObject['expiry_date'] = expiryDate;
          }
        }
      }
      // check plan id is available or not
      if (subscriptionData?.planId != null && subscriptionData?.planId != '') {
        const getPlan: Plan = await this.plans.findOne({
          _id: subscriptionData?.planId,
        });
        if (getPlan == null) throw new HttpException(400, 'Plan not found.');
        setObject['planId'] = subscriptionData?.planId;
      }

      //update the updated at and subscription
      setObject['updated_at'] = moment();
      const createData: any = await this.subscription.findOneAndUpdate(
        { _id: subscriptionData?.subscriptionId },
        {
          $set: setObject,
        },
      );

      // create transaction and check response is available or not
      if (subscriptionData?.response != null) {
        trans = {
          response: JSON.stringify(subscriptionData?.response),
          userId: createData._doc.userId.toString(),
          planId: createData._doc.planId.toString(),
          subscriptionId: createData._doc._id.toString(),
          created_at: moment(),
          updated_at: moment(),
          status: subscriptionData?.status,
        };

        if (subscriptionData?.address != null && subscriptionData?.address != '') {
          trans['address'] = subscriptionData?.address;
        }

        await this.transactions.create(trans);
      }
      return { ...createData._doc, transaction: trans };
    } catch (e) {
      throw new HttpException(400, 'Something went wrong. Please try again later.');
    }
  }
}

export default SubscriptionService;
