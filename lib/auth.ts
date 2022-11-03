import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export type RequestWithUser = NextApiRequest & { userId?: string };

export const authenticateUser = (req: RequestWithUser, res: NextApiResponse): void => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = auth.split(' ').reverse()[0];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const { userId } = decoded as any;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = userId;
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
