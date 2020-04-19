import multer from 'multer';
import path from 'path';

export default {
  directory: path.resolve(__dirname, '..', '..', 'tmp'),
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp'),
    filename(request, file, callback) {
      return callback(null, 'data.csv');
    },
  }),
};
