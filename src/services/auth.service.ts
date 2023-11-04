import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import {
  CreateUserDto,
  FanEmailDto,
  FanDetailsDto,
  ModelLinksDto,
  FanPasswordDto,
  FanDateOfBirthDto,
  FanGenderDto,
  FanLocationDto,
  ModelCategoriesDto,
  ModelDetailsDto,
  ModelAboutDto,
  ModelDOBDto,
  ModelPhotosDto,
  ModelVideoDto,
  ModelPassPortDto,
  GoogleLogin,
} from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { Subscription } from '@interfaces/subscription.interface';
import userModel from '@models/users.model';
import SubscriptionModel from '@models/subscriptions.model';
import PlanModel from '@models/plans.model';
import { isEmpty } from '@utils/util';
import moment from 'moment';

class AuthService {
  public users = userModel;
  public subscriptions = SubscriptionModel;
  public plans = PlanModel;

  //Model
  //**--- Step 1 */
  public async ModelDetails(userData: ModelDetailsDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    let findUser: User = null;
    let createUserData: any = null;
    const hashedPassword = await hash(userData.password, 10);
    userData.password = hashedPassword;
    // userData.type = 'model';
    if (userData?.userId != null && userData?.userId != '') {
      console.log(userData, 'userData');
      findUser = await this.users.findOne({ _id: Object(userData.userId) });
      if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
      createUserData = await this.users.findOneAndUpdate(
        { _id: userData.userId },
        {
          $set: {
            ...userData,
          },
        },
      );
    } else {
      // findUser = await this.users.findOne({ email: userData.email, type: 'model' });
      findUser = await this.users.findOne({ email: userData.email });
      if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
      createUserData = await this.users.create({ ...userData });
    }

    delete createUserData._doc.password;
    const tokenData = this.createToken(createUserData);
    createUserData._doc.token = tokenData.token;
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
      // { _id: userData.userId, type: 'model' },
      { _id: userData.userId },
      {
        $set: {
          date_of_birth: date,
        },
      },
    );

    // const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
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
      // { _id: userData.userId, type: 'model' },
      { _id: userData.userId },
      {
        $set: {
          passport_front: userData.passport_front,
          passport_back: userData.passport_back,
        },
      },
    );

    // const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
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
      // { _id: userData.userId, type: 'model' },
      { _id: userData.userId },
      {
        $set: {
          photos: userData.photos,
        },
      },
    );

    // const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }

  public async ModelVideos(userData: ModelVideoDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      // { _id: userData.userId, type: 'model' },
      { _id: userData.userId },
      {
        $set: {
          videos: userData.videos,
        },
      },
    );

    // const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }

  public async ModelLinks(userData: ModelLinksDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      // { _id: userData.userId, type: 'model' },
      { _id: userData.userId },
      {
        $set: {
          links: userData.links,
        },
      },
    );

    // const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  }

  public async ModelCategories(userData: ModelCategoriesDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    // issue on date
    const createUserData: User = await this.users.findOneAndUpdate(
      // { _id: userData.userId, type: 'model' },
      { _id: userData.userId },
      {
        $set: {
          categories: userData.categories,
        },
      },
    );

    // const findUserT: any = await this.users.findOne({ _id: userData.userId, type: 'model' });
    const findUserT: any = await this.users.findOne({ _id: userData.userId });
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

    const findUser: User = await this.users.findOne({ email: userData.email });
    // userData.type = 'fan';
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

    const findUserT: any = await this.users.findOne({ _id: userData.userId });

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
  public async FanDateofBirth(userData: FanDateOfBirthDto): Promise<User> {
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

  public async UpdateUserDetails(userId: string, userData: any): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    if (userData.date_of_birth) {
      userData.date_of_birth = moment(userData.date_of_birth, 'DD-MM-YYYY').utcOffset('+05:30');
    }

    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          ...userData,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userData.userId });

    delete findUserT._doc.password;
    const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
    findUserT._doc.date_of_birth = dob;
    return findUserT;
  }

  public changePassword = async (userId: string, userData: any): Promise<User> => {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );

    const findUserT: any = await this.users.findOne({ _id: userId });

    const tokenData = this.createToken(findUserT);
    findUserT._doc.token = tokenData.token;
    delete findUserT._doc.password;
    if (findUserT._doc?.date_of_birth != null) {
      const dob = moment(findUserT._doc.date_of_birth).format('DD-MM-YYYY');
      findUserT._doc.date_of_birth = dob;
    }
    return findUserT;
  };

  public async comparePassword(userData: any, userId: any): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: any = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, `This user not found`);

    const isPasswordMatching: boolean = await compare(userData.oldPassword, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Old Password is wrong!');

    return findUser;
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

  public async findUserByGoogleId(providerId: String): Promise<User> {
    const findUser: User = await this.users.findOne({ providerId: providerId });
    return findUser;
  }

  public async saveGoogleUser(userData: GoogleLogin): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: User = await this.users.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      providerId: userData.providerId,
      provider: userData.provider,
    });

    return createUserData;
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

    const findUser: any = await this.users.findOne({ email: userData.email, type: userData.type });
    // const findUser: any = await this.users.findOne({ email: userData.email });

    if (!findUser) throw new HttpException(409, `Invalid credentials, please try again.`);

    if (userData?.operation !== 'google') {
      const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');
    }

    const tokenData = this.createToken(findUser);
    findUser._doc.token = tokenData.token;
    delete findUser._doc.password;

    if (findUser._doc?.date_of_birth != null) {
      const dob = moment(findUser._doc.date_of_birth).format('DD-MM-YYYY');
      findUser._doc.date_of_birth = dob;
    }

    const subscription: any = await this.getUserSubscription(findUser._doc._id.toString());
    findUser._doc.subscription = subscription;

    //find plan
    // const plan: any = await this.getUserPlan(findUser._doc._id.toString());
    // findUser._doc.plan = plan;

    return findUser;
  }

  public async getUserPlan(userid: string): Promise<any> {
    const latest: any = await this.plans.findOne({ userId: userid });
    return latest;
  }

  public async getUserSubscription(userid: string): Promise<any> {
    await this.expirySubscriptionCheck(userid);
    const latest: any = await this.subscriptions.findOne({ userId: userid }).populate('planId');
    return latest;
  }

  public async expirySubscriptionCheck(userid: string): Promise<Boolean> {
    const allSub: Subscription[] = await this.subscriptions.find({ userId: userid, status: 'active' });

    for (let i = 0; i < allSub.length; i++) {
      const subscr = allSub[i];

      const expdate = moment(subscr.expiry_date);
      const cudate = moment();
      if (expdate.diff(cudate) < 0) {
        // update status;
        const up = await this.subscriptions.findOneAndUpdate(
          { _id: subscr._id },
          {
            $set: {
              status: 'expired',
            },
          },
        );
      }
    }
    return true;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public async me(userId: string): Promise<User> {
    const findUser: any = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, `This user not found`);

    const subscription: any = await this.getUserSubscription(findUser._doc._id.toString());
    findUser._doc.subscription = subscription;

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const findUser: any = await this.users.findOne({ email: email });

    return findUser;
  }

  public async resetPassword(email: string, password: string): Promise<User> {
    // const hashedPassword = await hash(userData.password, 10);
    const hashedPassword = await hash(password, 10);
    const findUser: any = await this.users.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );

    return findUser;
  }
}

export default AuthService;
