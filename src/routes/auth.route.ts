import { Param } from './../../node_modules/cloudinary-core/cloudinary-core.d';
import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import {
  CreateUserDto,
  FanEmailDto,
  FanDetailsDto,
  FanPasswordDto,
  FanDateofBirthDto,
  FanGenderDto,
  FanLocationDto,
  ModelDetailsDto,
  ModelAboutDto,
  ModelPhotosDto,
  ModelDOBDto,
  ModelPassPortDto,
} from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { cloudinary } from '@utils/cloudinary';
import multer from 'multer';
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';

import { CLOUDINARY_IMAGE_FOLDER } from '@config';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();
  public upload = multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: CLOUDINARY_IMAGE_FOLDER,
      },
    } as Options),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb('Not an image! Please upload only images.', false);
      }
    },
  });
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Fan
    this.router.post(`${this.path}fan/email`, validationMiddleware(FanEmailDto, 'body'), this.authController.FanEmail);
    this.router.post(`${this.path}fan/details`, validationMiddleware(FanDetailsDto, 'body'), this.authController.FanDetails);
    this.router.post(`${this.path}fan/password`, validationMiddleware(FanPasswordDto, 'body'), this.authController.FanPasword);
    this.router.post(`${this.path}fan/dob`, authMiddleware, validationMiddleware(FanDateofBirthDto, 'body'), this.authController.FanDateofBirth);
    this.router.post(`${this.path}fan/gender`, authMiddleware, validationMiddleware(FanGenderDto, 'body'), this.authController.FanGender);
    this.router.post(`${this.path}fan/location`, authMiddleware, validationMiddleware(FanLocationDto, 'body'), this.authController.FanLocation);

    // Model
    this.router.post(`${this.path}model/details`, validationMiddleware(ModelDetailsDto, 'body'), this.authController.ModelDetails);
    this.router.post(`${this.path}model/about`, validationMiddleware(ModelAboutDto, 'body'), this.authController.ModelAbout);
    this.router.post(`${this.path}model/dob`, validationMiddleware(ModelDOBDto, 'body'), this.authController.ModelDateOfBirth);
    this.router.post(
      `${this.path}model/passport`,
      this.upload.fields([
        { name: 'passport_front', maxCount: 1 },
        { name: 'passport_back', maxCount: 1 },
      ]),
      validationMiddleware(ModelPassPortDto, 'body'),
      this.authController.ModelPassPort,
    );

    this.router.post(
      `${this.path}model/photos`,
      this.upload.any('photos'),
      validationMiddleware(ModelPhotosDto, 'body'),
      this.authController.ModelPhotos,
    );

    // other
  /*  this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);*/
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
