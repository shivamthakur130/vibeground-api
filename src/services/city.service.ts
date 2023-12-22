import { HttpException } from '@exceptions/HttpException';
import { MeetAndGreet } from '@interfaces/meet-greet.interface';
import { City } from '@interfaces/city.interface';
import CityModel from '@models/cities.model';

import { isEmpty } from '@utils/util';

class CityService {
  public cityModel = CityModel;

  public async findByCountryCode(countryCode: string): Promise<City[]> {
    if (isEmpty(countryCode)) throw new HttpException(400, 'Invalid country Code');

    const findCity: City[] = await this.cityModel.find({ country_code: countryCode });
    if (!findCity) throw new HttpException(409, "City doesn't exist");

    return findCity;
  }
}

export default CityService;
