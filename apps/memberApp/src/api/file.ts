import {useMutation, UseMutationResult} from '@tanstack/react-query';

const API_BASE_URL = 'http://192.168.100.8:5000'; // Update with your API URL

interface UploadFileResponse {
  url?: string;
  id?: string;
  success: boolean;
  message?: string;
  error?: string;
}

export const useUploadFile = (): UseMutationResult<
  UploadFileResponse,
  unknown,
  FormData
> => {
  return useMutation<UploadFileResponse, unknown, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(API_BASE_URL + '/upload/', {
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
