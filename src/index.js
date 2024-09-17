import express from "express";
import dbConfig from "./configurations/dbConfig.js";
import "dotenv/config.js";
import cors from "cors";
import { swaggerDocs, swaggerUi } from "./configurations/swaggerConfig.js";
import { userRouter } from "./routes/userRouter.js";
import { roleRouter } from "./routes/roleRouter.js";
import { fileRouter } from "./routes/fileRouter.js";
import { permissionRouter } from "./routes/permissionRouter.js";
import { corsOptions } from "./static/constant.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "200mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/user", userRouter);
app.use("/v1/role", roleRouter);
app.use("/v1/file", fileRouter);
app.use("/v1/permission", permissionRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
dbConfig();
