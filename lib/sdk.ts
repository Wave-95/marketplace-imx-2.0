import { User } from '@prisma/client';
import { Item } from 'pages/api/orders';
import { fetchURL, postData } from '../utils/http';

export const createOrder = async (payload: { items: Item[] }) => {
  const orderResponse = await postData('/orders', payload);
  const order = await orderResponse.json();
  return order;
};

export const getUserByAddress = async (address: string): Promise<null | User> => {
  const userResponse = await fetchURL(`/user-by-address/${address}`);
  if (userResponse.status === 404) {
    return null;
  }
  const user = await userResponse.json();
  return user;
};

export const login = async (address: string, signature: string): Promise<{ token: string; user: User }> => {
  const loginResponse = await postData('/login', { eth_address: address, signature });
  const result = await loginResponse.json();
  return result;
};
