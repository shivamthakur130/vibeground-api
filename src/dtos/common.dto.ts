import { IsString } from 'class-validator';

export class SupportDto {
  @IsString()
  public email: string;

  @IsString()
  public message: string;

  @IsString()
  public reason: string;
}

export class GetCitiesDto {
  @IsString()
  public countryCode: string;
}
