import { IsString } from 'class-validator';

export class AddToFavoriteDto {
  @IsString()
  public userId: string;

  @IsString()
  public modelId: string;

  @IsString()
  public status: string;
}
