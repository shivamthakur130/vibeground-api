import { DB_HOST, DB_PORT, DB_DATABASE,MONGODB_URI } from '@config';

 /*  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`, */
export const dbConnection = {
  url: `${MONGODB_URI}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};
