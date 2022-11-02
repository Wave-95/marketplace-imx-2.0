import { fetchURL, postData } from '../utils';

export const getUserByAddress = async (address: string) => {
  const userResponse = await fetchURL(`/user-by-address/${address}`);
  if (userResponse.status === 404) {
    return null;
  } else if (userResponse.status === 404) {
    const user = await userResponse.json();
    return user;
  }
};

export const createUser = async (address: string) => {
  const createUserResponse = await postData('/users', { eth_address: address });
  const newUser = await createUserResponse.json();
  return newUser;
};
