import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import {
  CreateUserDto,
  FanEmailDto,
  FanDetailsDto,
  FanPasswordDto,
  FanDateofBirthDto,
  FanGenderDto,
  FanLocationDto,
  ModelDetailsDto,
  ModelAboutDto,
  ModelDOBDto,
  ModelPhotosDto,
  ModelPassPortDto,
} from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import moment from 'moment';

class AuthService {
  public users = userModel;

  //Model
  //**--- Step 1 */
  public async ModelDetails(userData: ModelDetailsDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const findUser: User = await this.users.findOne({ email: userData.email, type: 'model' });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const hashedPassword = await hash(userData.password, 10);
    userData.password = hashedPassword;
    userData.type = 'model';
    const createUserData: any = await this.users.create({ ...userData });
    delete createUserData._doc.password;
    if (createUserData._doc?.date_of_birth != null) {
      const dob = moment(createUserData._doc.date_of_birth).format('DD-MM-YYYY');
      createUserData._doc.date_of_birth = dob;
    }
    return createUserData;
  }

  public async ModelAbout(userData: ModelAboutDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          about: userData.about,
        },
      },
    );
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }

  public async ModelDateofBirth(userData: ModelDOBDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const date = moment(userData.dob, 'DD-MM-YYYY').utcOffset('+05:30');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId, type: 'model' },
      {
        $set: {
          date_of_birth: date,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }

  public async ModelPassPort(userData: ModelPassPortDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId, type: 'model' },
      {
        $set: {
          passport_front: userData.passport_front,
          passport_back: userData.passport_back,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }
  public async ModelPhotos(userData: ModelPhotosDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId, type: 'model' },
      {
        $set: {
          photos: userData.photos,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }

  // Fan
  //**--- Step 1 */
  public async FanEmail(userData: FanEmailDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, type: 'fan' });
    userData.type = 'fan';
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const createUserData: User = await this.users.create({ ...userData });

    return createUserData;
  }
  //**--- Step 2 */
  public async FanDetails(userData: FanDetailsDto): Promise<User> {
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

    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    if (findUserT._doc?.password != null) delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }
  //**--- Step 3 */
  public async FanPassword(userData: FanPasswordDto): Promise<User> {
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

    let findUserT: any = await this.users.findOne({ _id: userData.userId });

    const tokenData = this.createToken(findUserT);
    findUserT._doc.token = tokenData.token;
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
      
    }
    return findUserT;
  }
  //**--- Step 4 */
  public async FanDateofBirth(userData: FanDateofBirthDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const date = moment(userData.dob, 'DD-MM-YYYY').utcOffset('+05:30');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          date_of_birth: date,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    delete findUserT._doc.password;
    const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
    findUserT._doc.date_of_birth = dob;
    return findUserT;
  }

  //**--- Step 5 */
  public async FanGender(userData: FanGenderDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          gender: userData.gender,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    delete findUserT._doc.password;
    const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
    findUserT._doc.date_of_birth = dob;
    return findUserT;
  }
  //**--- Step 6 */
  public async FanLocation(userData: FanLocationDto): Promise<User> {
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

    const findUserT: any = await this.users.findOne({ _id: userData.userId });

    delete findUserT._doc.password;
    const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
    findUserT._doc.date_of_birth = dob;
    return findUserT;
  }

  // other

  public async findUserByIdWithType(userid: String, type: String): Promise<User> {
    const findUser: User = await this.users.findOne({ _id: userid, type: type });
    return findUser;
  }

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

  public async login(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    let findUser: any = await this.users.findOne({ email: userData.email, type: userData.type });

    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    findUser._doc.token = tokenData.token;
    delete findUser._doc.password;
    if (findUser._doc?.date_of_birth != null) {
      const dob = moment(findUser._doc.date_of_birth).format('DD-MM-YYYY');
      findUser._doc.date_of_birth = dob;
    }
    return findUser;
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
