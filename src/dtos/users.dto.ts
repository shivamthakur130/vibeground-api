import { IsEmail, IsString, MaxLength, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public type: string;

  @IsString()
  public password: string;
}

export class FanEmailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public type: string;
}

export class FanDetailsDto {
  @IsString()
  public userId: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public userName: string;
}

export class FanPasswordDto {
  @IsString()
  public userId: string;

  @IsString()
  public password: string;
}

export class FanDateOfBirthDto {
  @IsString()
  public userId: string;

  @IsString()
  public dob: string;
}

export class FanGenderDto {
  @IsString()
  public userId: string;

  @IsString()
  public gender: string;
}

export class FanLocationDto {
  @IsString()
  public userId: string;

  @IsString()
  public country: string;

  @IsString()
  public city: string;
}

// Model

export class ModelDetailsDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public userName: string;

  @IsString()
  public password: string;

  @IsEmail()
  public email: string;

  @IsString()
  public type: string;
}
export class ModelAboutDto {
  @IsString()
  @MaxLength(1024, { message: 'About Maximum length is less then or equals to 1024 character.' })
  public about: string;

  @IsString()
  public userId: string;
}

export class ModelDOBDto {
  @IsString()
  public userId: string;

  @IsString()
  public dob: string;
}
export class ModelPassPortDto {
  @IsString()
  public userId: string;

  @IsString()
  @IsOptional()
  public passport_front: string;

  @IsString()
  @IsOptional()
  public passport_back: string;
}

export class ModelPhotosDto {
  @IsString()
  public userId: string;

  @IsArray()
  @IsOptional()
  public photos: string[];
}

export class ModelVideoDto {
  @IsString()
  public userId: string;

  @IsArray()
  @IsOptional()
  public videos: string[];
}
