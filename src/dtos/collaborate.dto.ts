import { IsEmail, IsString } from 'class-validator';

export class SignUpCollaborateDto {
  @IsString()
  public phoneNumber: string;

  @IsString()
  @IsEmail()
  public emailId: string;

  @IsString()
  public instagramId: string;
}

export class BuyTicketDto {
  @IsString()
  public id: string;

  // @IsString()
  // public meetAndGreetId: string;
}
