import axios from "axios";
import { RequestHandler } from "express";
import FormData from "form-data";

export const controllerDetectFace: RequestHandler = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File not found in request",
      });
    }

    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    const response = await axios.post(
      "http://localhost:8000/mtcnn/detect-face/",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to connect with FastAPI backend",
    });
  }
};
