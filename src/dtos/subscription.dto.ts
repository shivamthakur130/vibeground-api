import { IsString, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  public userId: string;

  @IsString()
  public planId: string;

  @IsString()
  @IsOptional()
  public response: string;

  @IsString()
  @IsOptional()
  public status: string;
}

export class GetPlansDto {
  @IsString()
  public planId: string;
}

export class MakeSubscriptionDto {
  // @IsString()
  // public userId: string;

  @IsString()
  @IsOptional()
  public subscriptionId: string;

  @IsString()
  @IsOptional()
  public status: string;

  @IsString()
  @IsOptional()
  public planId: string;
}
