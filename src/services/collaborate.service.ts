import { HttpException } from '@exceptions/HttpException';
import { Collaborate } from '@interfaces/collaborate.interface';
import collaborateModel from '@models/collaborate.model';
import { SignUpCollaborateDto } from '@dtos/collaborate.dto';
import { isEmpty } from '@utils/util';

class CollaborateService {
  public collaborate = collaborateModel;

  public async create(collaborateData: SignUpCollaborateDto): Promise<Collaborate> {
    if (isEmpty(collaborateData)) throw new HttpException(400, 'collaborate data is empty');

    const createData: Collaborate = await this.collaborate.create({ ...collaborateData });
    return createData;
  }

  public async findByUserId(userId: any): Promise<Collaborate> {
    if (isEmpty(userId)) throw new HttpException(400, 'Invalid userId');

    const findRecord: Collaborate = await this.collaborate.findOne({ userId: userId, status: 'active' });

    return findRecord;
  }

  public async findAll(type: string): Promise<Collaborate[]> {
    const collaborate: Collaborate[] = await this.collaborate.find({ type: type });
    return collaborate;
  }

  public async findById(Id: string): Promise<Collaborate> {
    if (isEmpty(Id)) throw new HttpException(400, 'Invalid Id');

    const findRecord: Collaborate = await this.collaborate.findOne({ _id: Id });
    if (!findRecord) throw new HttpException(409, "Collaborate doesn't exist");

    return findRecord;
  }

  public async delete(Id: string): Promise<Collaborate> {
    if (isEmpty(Id)) throw new HttpException(400, 'Invalid Id');

    const deleteById: Collaborate = await this.collaborate.findByIdAndDelete(Id);
    if (!deleteById) throw new HttpException(409, "Collaborate doesn't exist");

    return deleteById;
  }

  public async update(Id: string, data: SignUpCollaborateDto): Promise<Collaborate> {
    if (isEmpty(data)) throw new HttpException(400, 'Invalid data');

    const updateById: Collaborate = await this.collaborate.findByIdAndUpdate(Id, { ...data });
    if (!updateById) throw new HttpException(409, "Collaborate doesn't exist");

    return updateById;
  }
}

export default CollaborateService;
