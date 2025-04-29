export type DetectFaceApi = {
  Endpoint: "/app/detect-face";
  Method: "POST";
  BODY: {
    file: File;
  };
  Response: {
    distance: number;
    face_count: number;
  };
  Error: ERRORS["notFound"];
};
