import { DetectFaceApi } from "@vt/core/apis/app/python";
import axios from "axios";
import { RequestHandler } from "express";
import FormData from "form-data"; // This must be imported (Node's version)

export const controllerDetectFace: RequestHandler<DetectFaceApi> = async (
  req,
  res
) => {
  try {
    const file = req.file; // This is populated by multer middleware
    const data = req.body;
    console.log(data);

    console.log(file);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const form = new FormData();
    form.append("file", file.buffer, file.originalname); // buffer, filename

    const response = await axios.post(
      "http://localhost:8000/mtcnn/detect-face/",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error forwarding file to FastAPI",
      error,
    });
  }
};
