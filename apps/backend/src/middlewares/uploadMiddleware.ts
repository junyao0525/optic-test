import multer from "multer";

// Use memory storage to avoid saving files to disk
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({ storage }).single("file");
