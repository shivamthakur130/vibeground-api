import {  IsString } from 'class-validator';

export class CreatePlansDto {
  @IsString()
  public name: string;

  @IsString()
  public price: string;

  @IsString()
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