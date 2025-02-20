interface FeaturesInterface {
  image: boolean;
  video: boolean;
  swipeModel: boolean;
  newComerOfWeek: boolean;
}
export interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  recommended: boolean;
  features: FeaturesInterface;
  planType: string;
}
