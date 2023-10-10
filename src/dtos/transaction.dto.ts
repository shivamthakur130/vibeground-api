import { IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  public userid: string;

  @IsString()
  public planid: string;

  @IsString()
  @IsOptional()
  public response: string;

  @IsString()
  @IsOptional()
  public status: string;
}


export class GetPlansDto {
  @IsString()
  public planid: string;
}