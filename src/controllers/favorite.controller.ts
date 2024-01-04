import e, { NextFunction, Request, Response } from 'express';
import { AddToFavoriteDto } from '@dtos/favorite.dto';
import { Favorite } from '@interfaces/favorite.interface';
import FavoriteService from '@/services/favorite.service';
import UserService from '@/services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';
import EmailService from '@/services/email.service';

class FavoriteController {
  public favoriteService = new FavoriteService();
  public userService = new UserService();
  public emailService = new EmailService();

  public getByUserId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id.toString();
      const favoriteData: Favorite = await this.favoriteService.findByUserId(userId);

      res.status(200).json({ data: favoriteData, message: 'Favorite fetched', status: true });
    } catch (error) {
      next(error);
    }
  };
  public signup = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const favoriteData: AddToFavoriteDto = req.body;
      const userId = req.user._id.toString();
      const modelId = favoriteData.modelId;
      const status = favoriteData.status;

      // check if already exist
      const favorite: Favorite | null = await this.favoriteService.findByModelIdUserId(modelId, userId);
      if (favorite) {
        if (favorite.status == status) throw new HttpException(409, 'You already liked this model');
        else {
          const updatedData: Favorite = await this.favoriteService.update(favorite._id, favoriteData);
          res.status(200).json({ data: updatedData, message: 'Favorite Updated', status: true });
        }
      } else {
        const prepareData = { ...favoriteData, userId: userId };
        const findAllMeetAndGreets: Favorite = await this.favoriteService.create(prepareData);
        res.status(201).json({ data: findAllMeetAndGreets, message: 'Favorite created', status: true });
      }
    } catch (error) {
      next(error);
    }
  };

  public getAllFavorites = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id.toString();
      const favoriteData: Favorite[] = await this.favoriteService.findByUserIdAllModel(userId);
      res.status(200).json({ data: favoriteData, message: 'Favorite fetched', status: true });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Id: string = req.params.id;
      const deleteData: Favorite = await this.favoriteService.delete(Id);
      res.status(200).json({ data: deleteData, message: 'Favorite Deleted', status: true });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const dataBody: AddToFavoriteDto = req.body;
      const updatedData: Favorite = await this.favoriteService.update(id, dataBody);
      res.status(200).json({ data: updatedData, message: 'Favorite Updated', status: true });
    } catch (error) {
      next(error);
    }
  };
}

export default FavoriteController;
