import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import "dotenv/config.js";

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const makeErrorResponse = ({ res, message, data }) => {
  return res.status(400).json({ result: false, message, data });
};

const makeSuccessResponse = ({ res, message, data }) => {
  return res.status(200).json({ result: true, message, data });
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

const encodePassword = async (rawPassword) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(rawPassword, salt);
};

const comparePassword = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};

const removeNullValues = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== null && item !== undefined)
      .map((item) => removeNullValues(item));
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [key, removeNullValues(value)])
    );
  }
  return obj;
};

const ignoreFields = (obj, ignoreFields) => {
  const result = { ...obj };
  ignoreFields.forEach((field) => {
    delete result[field];
  });
  return result;
};

const getPaginatedData = async ({
  model,
  queryOptions = {},
  populateOptions = "",
  req,
}) => {
  try {
    const {
      page = 0,
      size = 10,
      sort = "createdAt,desc",
      ...criteria
    } = req.query;

    const offset = parseInt(page, 10) * parseInt(size, 10);
    const limit = parseInt(size, 10);
    const [sortField, sortDirection] = sort.split(",");

    const query = {};
    for (const [key, value] of Object.entries(criteria)) {
      if (mongoose.isValidObjectId(value)) {
        query[key] = new mongoose.Types.ObjectId(value);
      } else if (!isNaN(value) && key !== "phone") {
        query[key] = Number(value);
      } else if (value) {
        query[key] = new RegExp(value, "i");
      }
    }

    let customeQuery = model.find({ ...query, ...queryOptions });

    if (populateOptions) {
      customeQuery = customeQuery.populate({
        path: populateOptions,
        select: "-permissions",
      });
    }

    const data = await customeQuery
      .skip(offset)
      .limit(limit)
      .sort({ [sortField]: sortDirection.toLowerCase() === "desc" ? -1 : 1 });

    const totalElements = await model.countDocuments({
      ...query,
      ...queryOptions,
    });
    const totalPages = Math.ceil(totalElements / limit);

    return {
      content: data,
      totalPages,
      totalElements,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const extractIdFromFilePath = (filePath) => {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  const id = fileName.split(".")[0];
  return id;
};

const deleteFileByUrl = async (url) => {
  if (url) {
    await cloudinary.uploader.destroy(extractIdFromFilePath(url));
  }
};

const createOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

const createSecretKey = () => {
  return otpGenerator.generate(16, {
    digits: true,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
    specialChars: false,
  });
};

const sendEmail = async ({ email, otp, subject }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  const mailOptions = {
    from: `NO REPLY <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject,
    text: `Mã xác thực OTP của bạn là: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

const parseDate = (dateString) => {
  const parts = dateString.split(/[\s/:]+/);
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const hours = parseInt(parts[3], 10);
  const minutes = parseInt(parts[4], 10);
  const seconds = parseInt(parts[5], 10);
  return new Date(year, month, day, hours, minutes, seconds);
};

export {
  makeErrorResponse,
  makeSuccessResponse,
  createToken,
  ignoreFields,
  encodePassword,
  comparePassword,
  removeNullValues,
  isValidObjectId,
  getPaginatedData,
  extractIdFromFilePath,
  deleteFileByUrl,
  sendEmail,
  createSecretKey,
  createOtp,
  parseDate,
};
