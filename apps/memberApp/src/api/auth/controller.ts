import bcrypt from 'react-native-bcrypt';
import { UpdateProfileData, User } from '../../../types/app/user';
import { supabase } from '../../config';

export const AuthController = {
  login: async (
    email: string,
    password: string,
  ): Promise<
    {success: true; user: any} | {success: false; message: string}
  > => {
    try {
      const {data: users, error} = await supabase
        .from('Users')
        .select('*')
        .eq('email', email)
        .limit(1);

      if (error || !users || users.length === 0) {
        return {success: false, message: 'User not found'};
      }

      const user = users[0];

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return {success: false, message: 'Invalid password'};
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Login error',
      };
    }
  },

  register: async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const {data: existingUsers} = await supabase
        .from('Users')
        .select('id')
        .eq('email', email);

      if (existingUsers && existingUsers.length > 0) {
        return {
          error: {
            message: 'Email already registered',
          },
        };
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const {data, error} = await supabase.from('Users').insert([
        {
          email,
          password: hashedPassword,
          name,
        },
      ]);

      return {data, error};
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'Registration failed',
        },
      };
    }
  },

  updateProfile: async (userId: number, profileData: UpdateProfileData) => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .update({
          name: profileData.name,
          gender: profileData.gender,
          dob: profileData.dob,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as User,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to update profile',
      };
    }
  },
};
