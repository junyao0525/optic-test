import {LoginUserApi} from '@vt/core/apis/app/auth';
import {createRequest} from './base';

export const useUserLoginApi = createRequest<LoginUserApi>(
  '/app/loginUser',
  'POST',
);
