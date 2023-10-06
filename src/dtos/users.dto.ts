import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}



export class FanStep1Dto {
  @IsEmail()
  public email: string;

  @IsString()
  public type: string;
}

export class FanStep2Dto {
  @IsString()
  public userId: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public userName: string;
}

export class FanStep3Dto {
  @IsString()
  public userId: string;

  @IsString()
  public password: string;
}

export class FanStep4Dto {
  @IsString()
  public userId: string;

  @IsString()
  public dob: string;
}

export class FanStep5Dto {
  @IsString()
  public userId: string;

  @IsString()
  public gender: string;
}


export class FanStep6Dto {
  @IsString()
  public userId: string;

  @IsString()
  public country: string;

  @IsString()
  public city: string;
}

