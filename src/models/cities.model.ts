import { model, Schema, Document } from 'mongoose';
import { City } from '@interfaces/city.interface';

const CitySchema: Schema = new Schema({
  // id: 68,
  id: { type: Number, required: true },
  // name: 'Fayzabad',
  name: { type: String, required: true },
  // state_id: 3901,
  state_id: { type: Number, required: true },
  // state_code: 'BDS',
  state_code: { type: String, required: true },
  // state_name: 'Badakhshan',
  state_name: { type: String, required: true },
  // country_id: 1,
  country_id: { type: Number, required: true },
  // country_code: 'AF',
  country_code: { type: String, required: true },
  // country_name: 'Afghanistan',
  country_name: { type: String, required: true },
  // latitude: '37.11664000',
  latitude: { type: String, required: true },
  // longitude: '70.58002000',
  longitude: { type: String, required: true },
  // wikiDataId: 'Q156558',
  wikiDataId: { type: String, required: true },
});

const CityModel = model<City & Document>('cities', CitySchema);

export default CityModel;
