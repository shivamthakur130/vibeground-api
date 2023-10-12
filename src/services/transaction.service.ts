import { HttpException } from '@exceptions/HttpException';
import { Transaction } from '@interfaces/transaction.interface';
import { Plan } from '@interfaces/plan.interface';
import TransactionModel from '@/models/transactions.model';
import PlanModel from '@models/plans.model';
import { isEmpty } from '@utils/util';

class TransactionService {
  public transaction = TransactionModel;
  public plans = PlanModel;

  public async getPlanWithId(planId: string, type: string): Promise<Plan> {
    const plans: Plan = await this.plans.findOne({ _id: planId, type: type });
    return plans;
  }

  public async create(planId: string, userId: string): Promise<Transaction> {
    if (isEmpty(planId)) throw new HttpException(400, 'Plan is required.');
    if (isEmpty(userId)) throw new HttpException(400, 'User is required.');

    const createData: Transaction = await this.transaction.create({ userId: userId, planId: planId });
    return createData;
  }
}

export default TransactionService;
