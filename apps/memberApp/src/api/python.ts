import {useMutation} from '@tanstack/react-query';

const API_BASE_URL = 'http://192.168.100.8:8000'; // Update with your API URL

interface FaceDetectionResponse {
  face_count: number;
  distances_cm?: number[];
  raw_output?: any;
  error?: string;
  message?: string;
}

// api/python.ts
export const useDetectFaceAPI = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(API_BASE_URL + '/mediapipe/detect-face/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    },
  });
};
