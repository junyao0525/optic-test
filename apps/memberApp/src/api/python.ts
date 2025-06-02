import { useMutation } from '@tanstack/react-query';
import { DetectAudioApi, DetectFaceApi } from '@vt/core/apis/app/python';

// const API_BASE_URL = BackendApiUrl;
const API_BASE_URL = 'http://192.168.1.22:8000/';
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
        API_BASE_URL + 'mediapipe/detect-face/',
      );
      const response = await fetch(API_BASE_URL + 'mediapipe/detect-face/', {
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

export const useDetectAudioAPI = () => {
  return useMutation<
    DetectAudioApi['Response'],
    DetectAudioApi['Error'],
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      const url = API_BASE_URL + 'whisper-lora/audio-transcriber/';
      console.log('Sending request to:', url);
      console.log('FormData:', formData);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log('Error response:', response);
        throw new Error('Audio detection failed : ' + response.statusText);
      }

      return (await response.json()) as DetectAudioApi['Response'];
    },
  });
};
