import { DetectFaceApi } from '@vt/core/apis/app/python';
import { createRequest } from './base';

export const useDetectFaceAPI = createRequest<DetectFaceApi>(
  "/app/detect-face",
  'POST',
);
