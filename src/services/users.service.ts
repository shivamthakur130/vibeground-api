import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import favoriteModel from '@/models/favorite.model';
import { isEmpty } from '@utils/util';
import { Favorite } from '@/interfaces/favorite.interface';

class UserService {
  public users = userModel;
  public favorite = favoriteModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.email) {
      const findUser: User = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }

  public async getModelProfile(userId: string): Promise<User> {
    const modelProfile: User = await this.users.findById(userId);
    if (!modelProfile) throw new HttpException(409, "User doesn't exist");

    return modelProfile;
  }

  public async getAllModelsProfile(filterCategories: any, userId: string): Promise<User[]> {
    const filterQry = { type: 'model', isActive: true };
    if (filterCategories !== '') {
      console.log(filterCategories, '==========================filterCategories');
      const filterCategoriesArray = filterCategories.split(',');
      if (filterCategoriesArray.length > 0) filterQry['categories'] = { $in: filterCategoriesArray };
    }
    //eliminate those models which are in favorite list
    const favoriteModels: Favorite[] = await this.favorite.find({ userId: userId }).select('modelId');
    const favoriteModelsArray = favoriteModels.map(item => item.modelId);
    const modelProfile: User[] = await this.users.find(filterQry).where('_id').nin(favoriteModelsArray);
    if (!modelProfile) throw new HttpException(409, "Model doesn't exist");

    return modelProfile;
  }

  public async getModelProfileById(userId: string): Promise<User> {
    const modelProfile: User = await this.users.findById(userId);
    if (!modelProfile) throw new HttpException(409, "Model doesn't exist");

    return modelProfile;
  }
}

export default UserService;
