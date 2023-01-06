import express from "express";
import path from "path";
import assetsRouter from "./assets-router";

const { PORT = 8000 } = process.env;

const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();

  if (isProd) {
    app.use("/", express.static(PROD_INDEX_PATH));
  } else {
    app.use("/", assetsRouter);
  }

  app.get("/api/v1", (req, res) => {
    res.json({
      project: "React and Express Boilerplate",
      from: "Vanaldito",
    });
  });

  app.get("/*", (_req, res) => {
    const htmlFile = path.join(
      isProd ? PROD_INDEX_PATH + "index.html" : DEV_INDEX_PATH + "dev.html"
    );

    res.sendFile(htmlFile);
  });

  return { app };
}

createServer().then(({ app }) =>
  app.listen(PORT, () => {
    console.log();
    console.log(`  App running in port ${PORT}`);
    console.log();
    console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
  })
);
