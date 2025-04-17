export type DetectFaceApi = {
  Endpoint: "/app/detect-face";
  Method: "POST";
  BODY: {
    file: string; // base64 string or FormData key if using multipart
  };
  Response: {
    distance: number;
    face_count: number;
  };
  Error: ERRORS["notFound"];
};

// error -> more than two faces detected -> show the error message as alert
// error -> when the distance is not
