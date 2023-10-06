import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto, FanStep1Dto, FanStep2Dto, FanStep3Dto, FanStep4Dto, FanStep5Dto, FanStep6Dto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import moment from 'moment';

class AuthService {
  public users = userModel;

  // Fan
  //**--- Step 1 */
  public async FanSetp1(userData: FanStep1Dto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const createUserData: User = await this.users.create({ ...userData });

    return createUserData;
  }
  //**--- Step 2 */
  public async FanSetp2(userData: FanStep2Dto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
        },
      },
    );

    const findUserT: User = await this.users.findOne({ _id: userData.userId });

    return findUserT;
  }
  //**--- Step 3 */
  public async FanSetp3(userData: FanStep3Dto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );

    const findUserT: User = await this.users.findOne({ _id: userData.userId });

    return findUserT;
  }
  //**--- Step 4 */
  public async FanSetp4(userData: FanStep4Dto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const date = moment(userData.dob, 'DD-MM-YYYY').utcOffset('+05:30');

    // issue on date
    console.log(date);

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          date_of_birth: date,
        },
      },
    );

    const findUserT: User = await this.users.findOne({ _id: userData.userId });

    return findUserT;
  }
  //**--- Step 5 */
  public async FanSetp5(userData: FanStep5Dto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          gender: userData.gender,
        },
      },
    );

    const findUserT: User = await this.users.findOne({ _id: userData.userId });

    return findUserT;
  }
  //**--- Step 6 */
  public async FanSetp6(userData: FanStep6Dto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          city: userData.city,
          country: userData.country,
        },
      },
    );

    const findUserT: User = await this.users.findOne({ _id: userData.userId });

    return findUserT;
  }

  // other

  public async findUserById(userid: String): Promise<User> {
    const findUser: User = await this.users.findOne({ _id: userid });
    return findUser;
  }

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
