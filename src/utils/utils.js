import CryptoJS from "crypto-js";
import "dotenv/config.js";

const encrypt = (value, secretKey) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

const decrypt = (encryptedValue, secretKey) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("JOIN_CONVERSATION", (conversationId) => {
      socket.join(conversationId);
    });
    socket.on("LEAVE_CONVERSATION", (conversationId) => {
      socket.leave(conversationId);
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export { encrypt, decrypt, setupSocketHandlers };
