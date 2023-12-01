import { Router } from 'express';
import CollaborateController from '@controllers/collaborate.controller';
import { SignUpCollaborateDto, BuyTicketDto } from '@dtos/collaborate.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import modelMiddleware from '@middlewares/model.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class Collaborate implements Routes {
  public path = '/collaborate';
  public router = Router();
  public collaborateController = new CollaborateController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, authMiddleware, modelMiddleware, this.collaborateController.getByUserId);

    this.router.post(
      `${this.path}/signup`,
      authMiddleware,
      modelMiddleware,
      validationMiddleware(SignUpCollaborateDto, 'body'),
      this.collaborateController.signup,
    );

    //get-model
    this.router.get(`${this.path}/get-model/:id`, authMiddleware, this.collaborateController.getModelCollaborate);

    //buy ticket for collaborate
    this.router.post(`${this.path}/buy-ticket`, authMiddleware, validationMiddleware(BuyTicketDto, 'body'), this.collaborateController.buyTicket);
  }
}

export default Collaborate;
