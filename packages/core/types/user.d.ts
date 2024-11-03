import { Gender } from "../constants/user";

export type User = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  gender?: Gender;
  dob: string; // ISO Date ex: YYYY-MM-DDTHH:mm:ss.SSSZ
  createDate: string; // ISO Date
};

export type Gender = keyof typeof Gender;
