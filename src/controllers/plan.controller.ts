import { NextFunction, Request, Response } from 'express';
import { CreatePlansDto } from '@dtos/plans.dto';
import { Plan } from '@interfaces/plan.interface';
import PlanService from '@services/plan.service';

class PlansController {
  public planService = new PlanService();

  public getPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllPlans: Plan[] = await this.planService.findAllPlan(req.params.type);

      res.status(200).json({ data: findAllPlans, message: 'Get All Plan' });
    } catch (error) {
      next(error);
    }
  };
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const planData: CreatePlansDto = req.body;

      const findAllPlans: Plan = await this.planService.createPlan(planData);
     
      res.status(201).json({ data: findAllPlans, message: 'Plan Created' });
    } catch (error) {
      next(error);
    }
  };
}

export default PlansController;
