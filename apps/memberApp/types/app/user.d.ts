import Gender from "../constants/gender";

export interface User {
  id: number;
  name: string;
  email: string;
  gender: Gender;
  dob: string; // ISO string format
  profile_image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserFormData {
  id: number;
  name: string;
  email: string;
  gender: Gender;
  dob: string; // ISO string format
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name: string;
  gender: Gender;
  dob: string;
}
