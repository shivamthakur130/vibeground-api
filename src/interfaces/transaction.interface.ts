export interface Transaction {
  _id: string;
  userId: string;
  planId: string;
  subscriptionId: string;
  response: string;
  status: string;
  address: string;
}
