import { NextFunction, Request, Response } from 'express';
import AuthService from '@services/auth.service';
import EmailService from '@services/email.service';
import { SupportDto } from '@dtos/common.dto';
import CityService from '@/services/city.service';
import { emailConfig } from '@config';

class CommonController {
  public authService = new AuthService();
  public emailService = new EmailService();
  public cityService = new CityService();

  public support = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SupportDto = req.body;

      const htmlTemplate = `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Query from user</title>
      </head>
      <body>
          <div style="text-align: left; background-color: #f2f2f2; padding: 20px;">
              <h1>Hello Admin</h1>
              <p>Email : ${userData.email}</p>
              <p>Title : ${userData.reason}</p>
              <p>Message : ${userData.message}</p>
              <p>Regards,<br/> Api Response</p>
          </div>
      </body>
      </html>`;

      const response = await this.emailService.sendEmail('support@vibeground.com', 'Support from user', htmlTemplate);

      res.status(200).json({ data: userData, message: 'Support sent', status: true });
    } catch (error) {
      next(error);
    }
  };

  public getCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { countryCode } = req.params;
      const cities = await this.cityService.findByCountryCode(countryCode);
      res.status(200).json({ data: cities, message: 'cities', status: true });
    } catch (error) {
      next(error);
    }
  };
}

export default CommonController;
