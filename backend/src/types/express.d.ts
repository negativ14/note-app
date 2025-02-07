// import { Request } from 'express';
// import { Types } from 'mongoose';

// export interface CustomRequest extends Request {
//   user: {
//     _id: Types.ObjectId;
//     username: string;
//     email: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
// }


import { Request } from 'express';
import { File } from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    file?: File;
  }
}