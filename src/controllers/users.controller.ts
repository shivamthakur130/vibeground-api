import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getModelProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const modelProfile: User = await this.userService.getModelProfile(userId);

      res.status(200).json({ data: modelProfile, message: 'get model profile' });
    } catch (error) {
      next(error);
    }
  };

  public getAllModelsProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const request = req.query;
      const userId = req.user._id.toString();
      console.log(userId, '==========================req');
      const filterCategories = request?.filterCategories;
      const modelProfile: User[] = await this.userService.getAllModelsProfile(filterCategories, userId);

      res.status(200).json({ data: modelProfile, message: 'Get all models profile' });
    } catch (error) {
      next(error);
    }
  };

  public getModelProfileById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const modelProfile: User = await this.userService.getModelProfileById(userId);

      res.status(200).json({ data: modelProfile, message: 'Get model profile by id' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
