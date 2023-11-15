import { IsEmail, IsString } from 'class-validator';

export class SignUpMeetAndGreetsDto {
  @IsString()
  public phoneNumber: string;

  @IsString()
  @IsEmail()
  public emailId: string;

  @IsString()
  public instagramId: string;
}
