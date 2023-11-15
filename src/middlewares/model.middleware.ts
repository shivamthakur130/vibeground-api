import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';

const modelMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser && findUser.type === 'model') {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Unauthorized you are not a model'));
      }
    } else {
      next(new HttpException(401, 'Unauthorized'));
    }
  } catch (error) {
    next(new HttpException(401, 'Unauthorized'));
  }
};

export default modelMiddleware;
