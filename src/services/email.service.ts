import { emailConfig, NODE_ENV } from '../config';
import path from 'path';
import nodemailer, { TransportOptions } from 'nodemailer';
// import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';
// import * as exphbs from 'express-handlebars';
import { EmailTemplate } from '../interfaces/email-template.interface';
import { logger } from '@utils/logger';
import { Options } from 'nodemailer/lib/mailer';

// point to the template folder
// const handlebarOptions: NodemailerExpressHandlebarsOptions = {
//   viewEngine: {
//     // helpers: {
//     //   inc: function (value: string, options: any) {
//     //     return parseInt(value) + 1;
//     //   },
//     // },
//     extname: '.handlebars', // handlebars extension
//     layoutsDir: path.resolve(__dirname, '../views/layouts/'), // location of handlebars templates
//     defaultLayout: path.resolve(__dirname, '../views/main/'), // name of main template
//     partialsDir: path.resolve(__dirname, '../views/'), // location of your subtemplates aka. header, footer etc
//   },
//   viewPath: path.resolve(__dirname, '../views/'),
//   extName: '.handlebars',
// };
// const handlebarsOptions: exphbs.ExphbsOptions = {
//   extname: 'hbs',
//   layoutsDir: 'views/layouts',
//   defaultLayout: 'main', // Provide the layout as a string
//   partialsDir: 'views/partials',
// };
// const nodemailerOptions: NodemailerExpressHandlebarsOptions = {
//   viewEngine: {
//     extname: 'hbs',
//     layoutsDir: 'views/layouts',
//     defaultLayout: 'main', // Provide the layout as a string
//     partialsDir: 'views/partials',
//   },
//   viewPath: 'views/emails',
//   extName: '.hbs',
// };
const smtp = emailConfig.email.smtp;
const transport = nodemailer.createTransport(smtp as TransportOptions);
// try {
//   transport.use('compile', hbs(nodemailerOptions));
// } catch (e: any) {
//   console.log('Error', e.toString());
// }
// /* istanbul ignore next */
if (NODE_ENV !== 'development') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

class EmailService {
  public withTemplate = async (template: EmailTemplate) => {
    try {
      // use a template file with nodemailer

      const { to, subject, template: templateName, context } = template;

      // // Send email
      await transport.sendMail({
        from: emailConfig.email.from,
        to,
        subject,
        template: templateName,
        context,
      } as Options);
    } catch (e: any) {
      console.log(e.toString());
    }
  };

  public sendEmail = async (to: string, subject: string, html: string) => {
    // Send email
    try {
      return await transport.sendMail({
        from: emailConfig.email.from,
        to: to,
        subject,
        html,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  };
}

export default EmailService;
