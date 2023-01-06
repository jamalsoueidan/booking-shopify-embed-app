import express from "express";

const router = express.Router();

const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/;

router.get(imageRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `http://localhost:3000/${filePath}`);
});

export default router;
