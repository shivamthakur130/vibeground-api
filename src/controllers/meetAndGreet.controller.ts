import { NextFunction, Request, Response } from 'express';
import { SignUpMeetAndGreetsDto } from '@dtos/meetAndGreets.dto';
import { MeetAndGreet } from '@interfaces/meet-greet.interface';
import MeetAndGreetService from '@/services/meet-greet.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';

class MeetAndGreetsController {
  public meetAndGreetService = new MeetAndGreetService();

  public getMeetAndGreetByUserId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id.toString();
      const meetAndGreet: MeetAndGreet = await this.meetAndGreetService.findByUserId(userId);

      res.status(200).json({ data: meetAndGreet, message: 'Meet and greet fetched', success: true });
    } catch (error) {
      next(error);
    }
  };
  public signup = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetData: SignUpMeetAndGreetsDto = req.body;
      const userId = req.user._id.toString();

      // check if already exist
      const meetAndGreet: MeetAndGreet = await this.meetAndGreetService.findByUserId(userId);
      if (meetAndGreet) throw new HttpException(409, 'Meet and greet already exist');

      const prepareData = { ...meetAndGreetData, userId: userId };
      const findAllMeetAndGreets: MeetAndGreet = await this.meetAndGreetService.create(prepareData);
      res.status(201).json({ data: findAllMeetAndGreets, message: 'Meet and greet created', success: true });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetId: string = req.params.meetAndGreetId;
      const deleteMeetAndGreetData: MeetAndGreet = await this.meetAndGreetService.delete(meetAndGreetId);
      res.status(200).json({ data: deleteMeetAndGreetData, message: 'Meet and greet Deleted', success: true });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetId: string = req.params.meetAndGreetId;
      const meetAndGreetData: SignUpMeetAndGreetsDto = req.body;
      const updateMeetAndGreetData: MeetAndGreet = await this.meetAndGreetService.update(meetAndGreetId, meetAndGreetData);
      res.status(200).json({ data: updateMeetAndGreetData, message: 'Meet and greet Updated', success: true });
    } catch (error) {
      next(error);
    }
  };

  public getMeetAndGreetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetId: string = req.params.meetAndGreetId;
      const findOneMeetAndGreetData: MeetAndGreet = await this.meetAndGreetService.findById(meetAndGreetId);
      res.status(200).json({ data: findOneMeetAndGreetData, message: 'Meet and greet fetch successfully', success: true });
    } catch (error) {
      next(error);
    }
  };
}

export default MeetAndGreetsController;
