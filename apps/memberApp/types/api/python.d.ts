export type DetectFaceApi = {
    Endpoint: "/mediapipe/detect-face/";
    Method: "POST";
    Body: {
      file: FormData;
    };
    Response: {
      timestamp: string;
      face_count: number;
      faces: {
        distance_cm: number;
        pixel_distance: number;
        is_too_near: boolean;
        is_centered: boolean;
        is_too_far: boolean;
      }[];
    };
    Error: ERRORS["notFound"];
  };
  
  export type DetectAudioApi = {
    Endpoint: "/whisper-lora/audio-transcriber/";
    Method: "POST";
    Body: {
      file: FormData;
    };
    Response: {
      transcription: string;
    };
    Error: ERRORS["notFound"];
  };
  