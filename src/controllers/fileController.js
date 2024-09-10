import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import cloudinary from "../utils/cloudinary.js";

const uploadFile = async (req, res) => {
  if (!req.file) {
    return makeErrorResponse({ res, message: "No file uploaded" });
  }
  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const bufferData = req.file.buffer;
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(bufferData);
    });
    return makeSuccessResponse({
      res,
      data: {
        filePath: uploadResponse.secure_url,
        id: uploadResponse.public_id,
      },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { uploadFile };
