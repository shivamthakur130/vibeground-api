import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set, ConnectOptions } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import bodyParser from 'body-parser';
class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    try {
      this.app.listen(this.port, () => {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`🚀 App listening on the port ${this.port}`);
        logger.info(`=================================`);
      });
    } catch (e: any) {
      console.log('Liten App Error', e.toString());
    }
  }

  public getServer() {
    try {
      return this.app;
    } catch (e: any) {
      console.log('Get Server Error', e.toString());
    }
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }
    try {
      connect(dbConnection.url, dbConnection.options as ConnectOptions)
        .then(() => console.log('Staging DB Connected'))
        .catch(error => {
          console.log('connection error', error.message);
        });
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  private initializeMiddlewares() {
    try {
      const origin_ = ORIGIN.split(',');
      this.app.use(morgan(LOG_FORMAT, { stream }));
      this.app.use(cors({ origin: origin_, credentials: CREDENTIALS }));
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(compression());
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(bodyParser.json());
      this.app.use(cookieParser());
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  private initializeRoutes(routes: Routes[]) {
    try {
      routes.forEach(route => {
        this.app.use('/', route.router);
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  private initializeSwagger() {
    try {
      const options = {
        swaggerDefinition: {
          info: {
            title: 'REST API',
            version: '1.0.0',
            description: 'Example docs',
          },
        },
        apis: ['swagger.yaml'],
      };

      const specs = swaggerJSDoc(options);
      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    } catch (e: any) {
      console.log(e.toString());
    }
  }

  private initializeErrorHandling() {
    try {
      this.app.use(errorMiddleware);
    } catch (error) {
      console.log(error.toString());
    }
  }
}

export default App;
