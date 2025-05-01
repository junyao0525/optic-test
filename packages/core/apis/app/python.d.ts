export type DetectFaceApi = {
  Endpoint: "/mediapipe/detect-face/";
  Method: "POST";
  BODY: {
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
