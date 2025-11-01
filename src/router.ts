import { Response, Router } from "express";
import Controller from "./controller";
import multer from "multer";
const router = Router();
const controller = new Controller();
const uploader = multer({ storage: multer.memoryStorage() });
router.get("/health", (_, res: Response) => {
  return res.send("Hello, World!");
});

router.post("/upload", uploader.single("file"), controller.upload.bind(controller));
router.get("/query", controller.query.bind(controller));

export default router;
