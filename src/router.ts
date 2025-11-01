import { Response, Router } from "express";
import Controller from "./controller";
import uploader from "./uploader";
const router = Router();
const controller = new Controller();

router.get("/health", (_, res: Response) => {
  return res.send("Hello, World!");
});

router.post(
  "/upload",
  uploader.single("file"),
  controller.upload.bind(controller)
);
router.get("/query", controller.query.bind(controller));
router.get("/response", controller.response.bind(controller));

export default router;
