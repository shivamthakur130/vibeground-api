import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);

    //get-all-models
    this.router.get(`${this.path}/get-all-models`, authMiddleware, this.usersController.getAllModelsProfile);

    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteUser);

    this.router.get(`${this.path}/:id/profile`, authMiddleware, this.usersController.getModelProfile);
  }
}

export default UsersRoute;
