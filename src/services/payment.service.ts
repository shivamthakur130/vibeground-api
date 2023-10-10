import { HttpException } from '@exceptions/HttpException';
import { Plan } from '@interfaces/plan.interface';
import { User } from '@interfaces/users.interface';
import planModel from '@models/plans.model';
import userModel from '@models/users.model';
import { CreatePlansDto } from '@dtos/plans.dto';
import { isEmpty } from '@utils/util';

class PaymentsService {
  public plans = planModel;
  public users = userModel;

  public async findUser(userid: string): Promise<User> {
    const user: User = await this.users.findOne({ _id: userid });
    return user;
  }
  public async findPlan(planid: string, type: string): Promise<Plan> {
    const plan: Plan = await this.plans.findOne({ _id: planid, type: type });
    return plan;
  }

  public async createPlan(planData: CreatePlansDto): Promise<Plan> {
    if (isEmpty(planData)) throw new HttpException(400, 'Plan Data is empty');

    const createData: Plan = await this.plans.create({ ...planData });
    return createData;
  }
}

export default PaymentsService;
