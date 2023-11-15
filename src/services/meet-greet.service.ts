import { HttpException } from '@exceptions/HttpException';
import { MeetAndGreet } from '@interfaces/meet-greet.interface';
import meetAndGreetModel from '@models/meet-greets.model';
import { SignUpMeetAndGreetsDto } from '@dtos/meetAndGreets.dto';
import { isEmpty } from '@utils/util';

class MeetAndGreetService {
  public meetAndGreets = meetAndGreetModel;

  public async create(meetAndGreetData: SignUpMeetAndGreetsDto): Promise<MeetAndGreet> {
    if (isEmpty(meetAndGreetData)) throw new HttpException(400, 'Meet and greet data is empty');

    const createData: MeetAndGreet = await this.meetAndGreets.create({ ...meetAndGreetData });
    return createData;
  }

  public async findByUserId(userId: any): Promise<MeetAndGreet> {
    if (isEmpty(userId)) throw new HttpException(400, 'Invalid userId');

    const findMeetAndGreet: MeetAndGreet = await this.meetAndGreets.findOne({ userId: userId, status: 'active' });
    // if (!findMeetAndGreet) throw new HttpException(409, "MeetAndGreet doesn't exist");

    return findMeetAndGreet;
  }

  public async findAll(type: string): Promise<MeetAndGreet[]> {
    const meetAndGreets: MeetAndGreet[] = await this.meetAndGreets.find({ type: type });
    return meetAndGreets;
  }

  public async findById(meetAndGreetId: string): Promise<MeetAndGreet> {
    if (isEmpty(meetAndGreetId)) throw new HttpException(400, 'Invalid meetAndGreetId');

    const findMeetAndGreet: MeetAndGreet = await this.meetAndGreets.findOne({ _id: meetAndGreetId });
    if (!findMeetAndGreet) throw new HttpException(409, "MeetAndGreet doesn't exist");

    return findMeetAndGreet;
  }

  public async delete(meetAndGreetId: string): Promise<MeetAndGreet> {
    if (isEmpty(meetAndGreetId)) throw new HttpException(400, 'Invalid meetAndGreetId');

    const deleteMeetAndGreetById: MeetAndGreet = await this.meetAndGreets.findByIdAndDelete(meetAndGreetId);
    if (!deleteMeetAndGreetById) throw new HttpException(409, "MeetAndGreet doesn't exist");

    return deleteMeetAndGreetById;
  }

  public async update(meetAndGreetId: string, meetAndGreetData: SignUpMeetAndGreetsDto): Promise<MeetAndGreet> {
    if (isEmpty(meetAndGreetData)) throw new HttpException(400, "You're not meetAndGreetData");

    const updateMeetAndGreetById: MeetAndGreet = await this.meetAndGreets.findByIdAndUpdate(meetAndGreetId, { ...meetAndGreetData });
    if (!updateMeetAndGreetById) throw new HttpException(409, "MeetAndGreet doesn't exist");

    return updateMeetAndGreetById;
  }
}

export default MeetAndGreetService;
