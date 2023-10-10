import { NextFunction, Request, Response } from 'express';
import { CreatePlansDto } from '@dtos/plans.dto';
import { Transaction } from '@interfaces/transaction.interface';
import { Plan } from '@interfaces/plan.interface';
import TransactionService from '@services/transaction.service';
import { HttpException } from '@exceptions/HttpException';

class TransactionController {
  public transactionService = new TransactionService();

  public getTransaction = async (req: any, res: Response, next: NextFunction) => {
    try {
      const findPlan: Plan = await this.transactionService.getPlanWithId(req.params.planid, req.user.type);

      if (findPlan == null) {
        throw new HttpException(404, `Plan not found.`);
      }
      console.log(req.user._id.toString());
      const getTransaction: Transaction = await this.transactionService.create(req.params.planid, req.user._id.toString());
      res.status(200).json({ data: getTransaction, message: 'Get Transaction Id' });
    } catch (error) {
      next(error);
    }
  };

}

export default TransactionController;
