import mongoose from "mongoose";
import "dotenv/config.js";

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "cookiedu_db" })
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT, () => {
      console.log("Listening on port 5000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database: ", error);
  });
