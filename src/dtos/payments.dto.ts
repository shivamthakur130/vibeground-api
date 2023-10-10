import { IsString } from 'class-validator';
 
export class ProcessPaymentDto {
  @IsString()
  public userid: string;

  @IsString()
  public planid: string;
}
