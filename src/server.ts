import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import PlanRoute from '@routes/plan.route';
import TransactionRoute from '@routes/transaction.route';
import SubscriptionRoute from '@routes/subscription.route';
import PaymentsRoute from '@routes/payments.route';
import MeetAndGreetRoute from '@routes/meetAndGreet.route';
import Collaborate from './routes/collaborate.route';
import CommonRoute from './routes/common.route';
import validateEnv from '@utils/validateEnv';

try {
  validateEnv();
  const app = new App([
    new IndexRoute(),
    new UsersRoute(),
    new AuthRoute(),
    new PlanRoute(),
    new TransactionRoute(),
    new PaymentsRoute(),
    new SubscriptionRoute(),
    new MeetAndGreetRoute(),
    new Collaborate(),
    new CommonRoute(),
  ]);

  app.listen();
} catch (e) {
  console.log(e.toString());
}
