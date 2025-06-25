import { useMutation } from '@tanstack/react-query';
import { FatigueDetectionApi } from '@vt/core/apis/app/python';
import { DetectAudioApi, DetectFaceApi } from '../../types/api/python';
import { BackendApiUrl } from '../config';

const API_BASE_URL = BackendApiUrl;

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
      const url = API_BASE_URL + 'whisper-small/audio-transcriber/';
      console.log('Sending request to:', url);
      console.log('FormData:', formData);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
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

export const useFatigueDetectionAPI = () => {
  return useMutation<
    FatigueDetectionApi['Response'],
    FatigueDetectionApi['Error'],
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(API_BASE_URL + 'fatigue/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Fatigue detection failed');
      }

      return (await response.json()) as FatigueDetectionApi['Response'];
    },
  });
};
