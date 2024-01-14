import { NextFunction, Request, Response } from 'express';
import { SignUpMeetAndGreetsDto } from '@dtos/meetAndGreets.dto';
import { MeetAndGreet } from '@interfaces/meet-greet.interface';
import { User } from '@/interfaces/users.interface';
import MeetAndGreetService from '@/services/meet-greet.service';
import UserService from '@/services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';
import EmailService from '@/services/email.service';
import { emailConfig } from '@config';

class MeetAndGreetsController {
  public meetAndGreetService = new MeetAndGreetService();
  public userService = new UserService();
  public emailService = new EmailService();

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
      const userData = req.user;
      const userId = req.user._id.toString();
      // check if already exist
      const meetAndGreet: MeetAndGreet = await this.meetAndGreetService.findByUserId(userId);
      if (meetAndGreet) throw new HttpException(409, 'Meet and greet already exist');

      const prepareData = { ...meetAndGreetData, userId: userId };
      const findAllMeetAndGreets: MeetAndGreet = await this.meetAndGreetService.create(prepareData);
      //send email to admin
      const subject = 'Meet and greet signup';
      const html = `
      <h1>Meet and greet signup</h1>
      <p>User name: ${userData.firstName + ' ' + userData.lastName}</p>
      <p>Meet and greet signup by : ${meetAndGreetData.emailId}</p>
      <p>Phone Number: ${meetAndGreetData.phoneNumber}</p>
      <p>Instagram Id: ${meetAndGreetData.instagramId}</p>
      <p>Regards,<br/> Api Response</p>
      `;

      await this.emailService.sendEmail(emailConfig.email.adminEmail, subject, html);

      res.status(201).json({ data: findAllMeetAndGreets, message: 'Meet and greet created', success: true });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetId: string = req.params.meetAndGreetId;
      const deleteMeetAndGreetData: MeetAndGreet = await this.meetAndGreetService.delete(meetAndGreetId);
      res.status(200).json({ data: deleteMeetAndGreetData, message: 'Meet and greet Deleted', status: true });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetId: string = req.params.meetAndGreetId;
      const meetAndGreetData: SignUpMeetAndGreetsDto = req.body;
      const updateMeetAndGreetData: MeetAndGreet = await this.meetAndGreetService.update(meetAndGreetId, meetAndGreetData);
      res.status(200).json({ data: updateMeetAndGreetData, message: 'Meet and greet Updated', status: true });
    } catch (error) {
      next(error);
    }
  };

  public getMeetAndGreetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetAndGreetId: string = req.params.meetAndGreetId;
      const findOneMeetAndGreetData: MeetAndGreet = await this.meetAndGreetService.findById(meetAndGreetId);
      res.status(200).json({ data: findOneMeetAndGreetData, message: 'Meet and greet fetch successfully', status: true });
    } catch (error) {
      next(error);
    }
  };

  public getModelMeetAndGreets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = '655a554a09facc7a369559a0';
      const userModel: User = await this.userService.findUserById(userId);
      res.status(200).json({ data: userModel, message: 'Model for user', status: true });
    } catch (error) {
      next(error);
    }
  };
  public buyTicket = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id.toString();
      // get the email and send it to the user about your ticket is booked
      const findUser = await this.userService.findUserById(userId);
      const email = findUser.email;
      const subject = 'Ticket booked';
      const html = 'Your ticket is booked';
      await this.emailService.sendEmail(email, subject, html);
      const booked = {
        isBooked: true,
        userId: userId,
      };
      res.status(201).json({ data: booked, message: 'Ticket booked', status: true });
    } catch (error) {
      next(error);
    }
  };
}

export default MeetAndGreetsController;
