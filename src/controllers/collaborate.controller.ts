import { NextFunction, Request, Response } from 'express';
import { SignUpCollaborateDto } from '@dtos/collaborate.dto';
import { Collaborate } from '@interfaces/collaborate.interface';
import { User } from '@/interfaces/users.interface';
import CollaborateService from '@/services/collaborate.service';
import UserService from '@/services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@exceptions/HttpException';
import EmailService from '@/services/email.service';
import { emailConfig } from '@config';

class CollaborateController {
  public collaborateService = new CollaborateService();
  public userService = new UserService();
  public emailService = new EmailService();

  public getByUserId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user._id.toString();
      const collaborateData: Collaborate = await this.collaborateService.findByUserId(userId);

      res.status(200).json({ data: collaborateData, message: 'Collaborate fetched', success: true });
    } catch (error) {
      next(error);
    }
  };
  public signup = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const collaborateData: SignUpCollaborateDto = req.body;
      const userId = req.user._id.toString();

      // check if already exist
      const collaborate: Collaborate = await this.collaborateService.findByUserId(userId);
      if (collaborate) throw new HttpException(409, 'Collaborate already exist');

      const prepareData = { ...collaborateData, userId: userId };
      const findAllMeetAndGreets: Collaborate = await this.collaborateService.create(prepareData);
      //send email to admin
      const subject = 'Meet and greet signup';
      const html = `
        <h1>Collaborate signup</h1>
        <p>Collaborate signup by : ${collaborateData.emailId}</p>
        <p>Phone Number: ${collaborateData.phoneNumber}</p>
        <p>Instagram Id: ${collaborateData.instagramId}</p>
        <p>Regards,<br/> Api Response</p>
              `;

      await this.emailService.sendEmail(emailConfig.email.adminEmail, subject, html);
      res.status(201).json({ data: findAllMeetAndGreets, message: 'Collaborate created', success: true });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Id: string = req.params.id;
      const deleteData: Collaborate = await this.collaborateService.delete(Id);
      res.status(200).json({ data: deleteData, message: 'Collaborate Deleted', status: true });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const dataBody: SignUpCollaborateDto = req.body;
      const updatedData: Collaborate = await this.collaborateService.update(id, dataBody);
      res.status(200).json({ data: updatedData, message: 'Collaborate Updated', status: true });
    } catch (error) {
      next(error);
    }
  };

  public getCollaborateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const findOneData: Collaborate = await this.collaborateService.findById(id);
      res.status(200).json({ data: findOneData, message: 'Collaborate fetch successfully', status: true });
    } catch (error) {
      next(error);
    }
  };

  public getModelCollaborate = async (req: Request, res: Response, next: NextFunction) => {
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

export default CollaborateController;
