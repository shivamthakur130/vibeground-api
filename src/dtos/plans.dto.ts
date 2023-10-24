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

  @IsString()
  public planType: string;

  // "min_pics": 2,
  @IsNumber()
  public min_pics: number;
  //   "max_pics": 3,
  @IsNumber()
  public max_pics: number;
  //   "min_videos": 2,
  @IsNumber()
  public min_videos: number;
  //   "max_videos": 3,
  @IsNumber()
  public max_videos: number;
  //   "min_links": 1,
  @IsNumber()
  public min_links: number;
  //   "max_links": 5,
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
  // @IsString()
  // public planId: string;

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

  // "min_pics": 2,
  @IsNumber()
  public min_pics: number;
  //   "max_pics": 3,
  @IsNumber()
  public max_pics: number;
  //   "min_videos": 2,
  @IsNumber()
  public min_videos: number;
  //   "max_videos": 3,
  @IsNumber()
  public max_videos: number;
  //   "min_links": 1,
  @IsNumber()
  public min_links: number;
  //   "max_links": 5,
  @IsNumber()
  public max_links: number;
}
