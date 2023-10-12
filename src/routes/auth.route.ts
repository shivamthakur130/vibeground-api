import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import {
  CreateUserDto,
  FanEmailDto,
  FanDetailsDto,
  FanPasswordDto,
  FanDateOfBirthDto,
  FanGenderDto,
  FanLocationDto,
  ModelDetailsDto,
  ModelAboutDto,
  ModelPhotosDto,
  ModelLinksDto,
  ModelDOBDto,
  ModelCategoriesDto,
  ModelPassPortDto,
  ModelVideoDto,
} from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { cloudinary } from '@utils/cloudinary';
import multer from 'multer';
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';

import { CLOUDINARY_IMAGE_FOLDER, CLOUDINARY_VIDEO_FOLDER } from '@config';

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
  public uploadVideo = multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      limits: {
        fieldSize: 1000 * 1024 * 1024, // 1 GB
      },
      params: {
        folder: CLOUDINARY_VIDEO_FOLDER,
        resource_type: 'video',
      },
    } as Options),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('video')) {
        cb(null, true);
      } else {
        cb('Not an video! Please upload only videos.', false);
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
    this.router.post(`${this.path}fan/password`, validationMiddleware(FanPasswordDto, 'body'), this.authController.FanPassword);
    this.router.post(`${this.path}fan/dob`, validationMiddleware(FanDateOfBirthDto, 'body'), this.authController.FanDateOfBirth);
    this.router.post(`${this.path}fan/gender`, validationMiddleware(FanGenderDto, 'body'), this.authController.FanGender);
    this.router.post(`${this.path}fan/location`, validationMiddleware(FanLocationDto, 'body'), this.authController.FanLocation);

    // Model
    this.router.post(`${this.path}model/details`, validationMiddleware(ModelDetailsDto, 'body'), this.authController.ModelDetails);
    this.router.post(`${this.path}model/about`, validationMiddleware(ModelAboutDto, 'body'), this.authController.ModelAbout);
    // this.router.post(`${this.path}model/dob`, validationMiddleware(ModelDOBDto, 'body'), this.authController.ModelDateOfBirth);
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

    this.router.post(
      `${this.path}model/videos`,
      this.uploadVideo.any('videos'),
      validationMiddleware(ModelVideoDto, 'body'),
      this.authController.ModelVideos,
    );

    this.router.post(`${this.path}model/links`, validationMiddleware(ModelLinksDto, 'body'), this.authController.ModelLinks);
    this.router.post(`${this.path}model/categories`, validationMiddleware(ModelCategoriesDto, 'body'), this.authController.ModelCategories);

    // other
    /*  this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);*/
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
    this.router.get(`${this.path}me`, authMiddleware, this.authController.me);
  }
}

export default AuthRoute;
