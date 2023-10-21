import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import PlanRoute from '@routes/plan.route';
import TransactionRoute from '@routes/transaction.route';
import SubscriptionRoute from '@routes/subscription.route';
import PaymentsRoute from '@routes/payments.route';
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
  ]);

  app.listen();
} catch (e) {
  console.log(e.toString());
}
