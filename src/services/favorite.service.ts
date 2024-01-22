import { HttpException } from '@exceptions/HttpException';
import { Favorite } from '@interfaces/favorite.interface';
import favoriteModel from '@models/favorite.model';
import { AddToFavoriteDto } from '@dtos/favorite.dto';
import { isEmpty } from '@utils/util';

class FavoriteService {
  public favorite = favoriteModel;

  public async create(favoriteData: AddToFavoriteDto): Promise<Favorite> {
    if (isEmpty(favoriteData)) throw new HttpException(400, 'favorite data is empty');

    const createData: Favorite = await this.favorite.create({ ...favoriteData });
    return createData;
  }

  public async findByUserId(userId: any): Promise<Favorite> {
    if (isEmpty(userId)) throw new HttpException(400, 'Invalid userId');

    // model details with favorite all to that user
    const findRecord = await this.favorite.findOne({ userId: userId });

    return findRecord;
  }

  public async findByModelIdUserId(modelId: any, userId: any): Promise<Favorite> {
    if (isEmpty(modelId)) throw new HttpException(400, 'Invalid modelId');

    // model details with favorite all to that user
    const findRecord = await this.favorite.findOne({ modelId: modelId, userId: userId });

    return findRecord;
  }

  public async findByUserIdAllModel(userId: any): Promise<Favorite[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'Invalid userId');

    // model details with favorite all to that user
    const findRecord = await this.favorite.find({ userId: userId, status: 'accepted' }).populate('modelId', 'userName date_of_birth city photos');
    return findRecord;
  }

  public async findAll(type: string): Promise<Favorite[]> {
    const favorite: Favorite[] = await this.favorite.find({ type: type });
    return favorite;
  }

  public async findById(Id: string): Promise<Favorite> {
    if (isEmpty(Id)) throw new HttpException(400, 'Invalid Id');

    const findRecord: Favorite = await this.favorite.findOne({ _id: Id });
    if (!findRecord) throw new HttpException(409, "Favorite doesn't exist");

    return findRecord;
  }

  public async delete(Id: string): Promise<Favorite> {
    if (isEmpty(Id)) throw new HttpException(400, 'Invalid Id');

    const deleteById: Favorite = await this.favorite.findByIdAndDelete(Id);
    if (!deleteById) throw new HttpException(409, "Favorite doesn't exist");

    return deleteById;
  }

  public async update(Id: string, data: AddToFavoriteDto): Promise<Favorite> {
    if (isEmpty(data)) throw new HttpException(400, 'Invalid data');
    console.log('data ================================================', data);
    const updateById: Favorite = await this.favorite.findByIdAndUpdate(Id, { ...data });
    if (!updateById) throw new HttpException(409, "Favorite doesn't exist");

    return updateById;
  }
}

export default FavoriteService;
