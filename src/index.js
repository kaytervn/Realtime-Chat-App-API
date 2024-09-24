import express from "express";
import dbConfig from "./configurations/dbConfig.js";
import "dotenv/config.js";
import cors from "cors";
import job from "./utils/cron.js";
import { swaggerDocs, swaggerUi } from "./configurations/swaggerConfig.js";
import { userRouter } from "./routes/userRouter.js";
import { roleRouter } from "./routes/roleRouter.js";
import { fileRouter } from "./routes/fileRouter.js";
import { permissionRouter } from "./routes/permissionRouter.js";
import { corsOptions } from "./static/constant.js";
import { postRouter } from "./routes/postRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { conversationRouter } from "./routes/conversationRouter.js";
import { conversationMemberRouter } from "./routes/conversationMemberRouter.js";
import { friendshipRouter } from "./routes/friendshipRouter.js";
import { messageReactionRouter } from "./routes/messageReactionRouter.js";
import { messageRouter } from "./routes/messageRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js";
import { postReactionRouter } from "./routes/postReactionRouter.js";
import { reactionRouter } from "./routes/reactionRouter.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "200mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/user", userRouter);
app.use("/v1/role", roleRouter);
app.use("/v1/file", fileRouter);
app.use("/v1/permission", permissionRouter);
app.use("/v1/post", postRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/conversation", conversationRouter);
app.use("/v1/conversation-member", conversationMemberRouter);
app.use("/v1/friendship", friendshipRouter);
app.use("/v1/message-reaction", messageReactionRouter);
app.use("/v1/message", messageRouter);
app.use("/v1/notification", notificationRouter);
app.use("/v1/post-reaction", postReactionRouter);
app.use("/v1/reaction", reactionRouter);

job.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
dbConfig();
