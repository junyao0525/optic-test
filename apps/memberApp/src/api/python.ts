import {useMutation} from '@tanstack/react-query';
import {DetectFaceApi} from '@vt/core/apis/app/python';

const API_BASE_URL = 'http://192.168.100.8:8000';
// api/python.ts

export const useDetectFaceAPI = () => {
  return useMutation<
    DetectFaceApi['Response'],
    DetectFaceApi['Error'],
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(API_BASE_URL + '/mediapipe/detect-face/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // You can handle specific errors here if needed
        throw new Error('Face detection failed');
      }

      return (await response.json()) as DetectFaceApi['Response'];
    },
  });
};
