import { IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';

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

  @IsString()
  public planType: string;

  @IsNumber()
  public min_pics: number;

  @IsNumber()
  public max_pics: number;

  @IsNumber()
  public min_videos: number;

  @IsNumber()
  public max_videos: number;

  @IsNumber()
  public min_links: number;

  @IsNumber()
  public max_links: number;
}

export class GetPlansDto {
  @IsString()
  public type: string;
}

export class paramIdDto {
  @IsString()
  public planId: string;
}

export class UpdatePlansDto {
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

  @IsString()
  public planType: string;

  @IsNumber()
  public min_pics: number;

  @IsNumber()
  public max_pics: number;

  @IsNumber()
  public min_videos: number;

  @IsNumber()
  public max_videos: number;

  @IsNumber()
  public min_links: number;

  @IsNumber()
  public max_links: number;
}
