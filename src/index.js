import express from "express";
import mongoose from "mongoose";
import path from "path";

const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(express.json());

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);


