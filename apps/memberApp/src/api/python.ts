import { BACKEND_API_URL } from '@env';
import { useMutation } from '@tanstack/react-query';
import { DetectFaceApi } from '@vt/core/apis/app/python';

const API_BASE_URL = BACKEND_API_URL;
// api/python.ts

export const useDetectFaceAPI = () => {
  return useMutation<
    DetectFaceApi['Response'],
    DetectFaceApi['Error'],
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      console.log(
        'Sending request to:',
        API_BASE_URL + '/mediapipe/detect-face/',
      );
      const response = await fetch(API_BASE_URL + '/mediapipe/detect-face/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log('Error response:', response);
        throw new Error('Face detection failed : ' + response.statusText);
      }

      return (await response.json()) as DetectFaceApi['Response'];
    },
  });
};
