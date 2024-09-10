import express from "express";
import dbConfig from "./configurations/dbConfig.js";
import "dotenv/config.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { roleRoutes } from "./routes/roleRoutes.js";
import { swaggerDocs, swaggerUi } from "./configurations/swaggerConfig.js";
import { permissionRoutes } from "./routes/permissionRoutes.js";
import { fileRoutes } from "./routes/fileRoutes.js";

const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/user", userRoutes);
app.use("/v1/role", roleRoutes);
app.use("/v1/file", fileRoutes);
app.use("/v1/permission", permissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
dbConfig();
