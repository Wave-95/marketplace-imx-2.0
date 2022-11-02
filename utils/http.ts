import { server_base_uri } from '@/constants/configs';
import Cookies from 'js-cookie';

const getAuthHeader = () => {
  const token = Cookies.get('marketplace:token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return undefined;
  }
};

export const fetchURL = async (endpoint: string) => {
  return await fetch(`${server_base_uri}/${endpoint}`);
};

export const postData = async (endpoint: string, data: any) => {
  return await fetch(`${server_base_uri}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
};
