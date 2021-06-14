import axios, { AxiosResponse } from 'axios';

export const proxy = {
  post: async (url: string, body: any): Promise<AxiosResponse> => {
    const res = await axios.post(url, body);
    return res;
  },
};
