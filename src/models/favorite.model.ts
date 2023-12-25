import { model, Schema, Document } from 'mongoose';
import { Favorite } from '@interfaces/favorite.interface';

const FavoriteSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  modelId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const favoriteModel = model<Favorite & Document>('favorite', FavoriteSchema);

export default favoriteModel;
