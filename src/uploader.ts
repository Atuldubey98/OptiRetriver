import multer from "multer";
import { supportedMimeTypes } from "./constants";
import path from "path";

const uploader = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const destinationDir = process.env.UPLOAD_DIR || "./uploads"; 
      const docType = _req.query.type as string || "general";
      cb(null, path.join(destinationDir, docType));
    },
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file) {
      return cb(new Error("No file provided"));
    }
    if(!supportedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    if(file.size === 0) {
      return cb(new Error("Empty file provided"));
    }
    if (file.size > 5*1024*1024) {
      return cb(new Error("File size exceeds limit of 5MB"));
    }
    cb(null, true);
  },
});

export default uploader;