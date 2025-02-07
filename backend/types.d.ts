// @types/express/index.d.ts

import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        username: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}
