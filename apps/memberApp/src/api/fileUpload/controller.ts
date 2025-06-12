import { Asset } from 'react-native-image-picker';
import { supabase } from '../../config';

export const FileUploadController = {
  uploadProfileImage: async (userId: number, image: Asset) => {
    try {
      if (!image.uri) {
        throw new Error('No image selected');
      }

      // Create a unique file name
      const fileExt = image.uri.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      // Convert image to blob
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, blob, {
          contentType: image.type,
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update user profile with new image URL
      const { error: updateError } = await supabase
        .from('Users')
        .update({ profile_image_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return {
        success: true,
        data: {
          url: publicUrl,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to upload image',
      };
    }
  },
};
