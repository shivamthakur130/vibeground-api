import { IsString, IsNumber } from 'class-validator';

export class CreatePlansDto {
  @IsString()
  public name: string;

  @IsNumber()
  public price: string;

  @IsNumber()
  public duration: string;

  @IsString()
  public description: string;

  @IsString()
  public features: string;

  @IsString()
  public type: string;
}

export class GetPlansDto {
  @IsString()
  public type: string;
}