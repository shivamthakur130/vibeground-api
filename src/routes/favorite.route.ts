import { Router } from 'express';
import FavoriteController from '@controllers/favorite.controller';
import { AddToFavoriteDto } from '@dtos/favorite.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import modelMiddleware from '@middlewares/model.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class Collaborate implements Routes {
  public path = '/favorite';
  public router = Router();
  public favoriteController = new FavoriteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/get`, authMiddleware, modelMiddleware, this.favoriteController.getByUserId);

    this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(AddToFavoriteDto, 'body'), this.favoriteController.signup);

    //get-all-favorites
    this.router.get(`${this.path}/get-all`, authMiddleware, this.favoriteController.getAllFavorites);

    //remove-favorite
    this.router.delete(`${this.path}/remove/:id`, authMiddleware, this.favoriteController.delete);
  }
}

export default Collaborate;
