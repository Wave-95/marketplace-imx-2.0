import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: NextApiRequest, res: NextApiResponse): string | void => {
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
    return userId;
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
