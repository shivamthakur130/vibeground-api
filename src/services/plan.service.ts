import { HttpException } from '@exceptions/HttpException';
import { Plan } from '@interfaces/plan.interface';
import planModel from '@models/plans.model';
import {CreatePlansDto} from '@dtos/plans.dto';
import { isEmpty } from '@utils/util';

class PlanService {
  public plans = planModel;

  public async findAllPlan(type: string): Promise<Plan[]> {
    const plans: Plan[] = await this.plans.find({type:type});
    return plans;
  }
  public async createPlan(planData: CreatePlansDto): Promise<Plan> {
    if (isEmpty(planData)) throw new HttpException(400, 'Plan Data is empty');

    const createData: Plan = await this.plans.create({ ...planData });
    return createData;
  }
}

export default PlanService;
