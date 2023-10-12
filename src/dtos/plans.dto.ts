import { IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
// import { IsString } from 'class-validator';

export class CreatePlansDto {
  @IsString()
  public name: string;

  @IsNumber()
  public price: string;

  @IsNumber()
  public duration: string;

  @IsString()
  public description: string;

  @IsObject()
  public features: Object;

  @IsBoolean()
  public recommended: boolean;

  @IsString()
  public type: string;
}

export class GetPlansDto {
  @IsString()
  public type: string;
}

export class paramIdDto {
  @IsString()
  public planId: string;
}
