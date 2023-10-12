export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  status: string;
  response: string;
  purchase_date: Date;
  expiry_date: Date;
  created_at: Date;
  updated_at: Date;
}
