import { IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  public userId: string;

  @IsString()
  public planId: string;

  @IsString()
  public subscriptionId: string;

  @IsString()
  @IsOptional()
  public response: string;

  @IsString()
  @IsOptional()
  public address: string;

  @IsString()
  @IsOptional()
  public cardname: string;
}

export class GetPlansDto {
  @IsString()
  public planid: string;
}
