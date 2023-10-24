import { IsEmail, IsString, MaxLength, IsOptional, IsArray, ArrayMinSize, ArrayMaxSize, IsUrl, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public type: string;

  @IsString()
  public password: string;

  @IsString()
  @IsOptional()
  public operation: string;
}
export class QueryUserDto {
  @IsEmail()
  public email: string;
}
export class GoogleLogin {
  @IsString()
  public access_token: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public email: string;

  @IsString()
  public picture: string;

  @IsString()
  public provider: string;

  @IsString()
  public providerId: string;
}

export class FanEmailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public type: string;

  @IsString()
  @IsOptional()
  public userId: string;
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

  @IsString()
  @IsOptional()
  public userId: string;
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

  @IsArray()
  @IsOptional()
  public photosExisting: string[];
}

export class ModelVideoDto {
  @IsString()
  public userId: string;

  @IsArray()
  @IsOptional()
  public videos: string[];

  @IsArray()
  @IsOptional()
  public videosExisting: string[];
}

export class ModelLinksDto {
  @IsString()
  public userId: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  //@IsUrl({ each: true, require_protocol: true, require_valid_protocol: true })
  public links: string[];
}
export class ModelCategoriesDto {
  @IsString()
  public userId: string;

  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  public categories: string[];
}
