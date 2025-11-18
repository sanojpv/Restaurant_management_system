// utils/uploadImgBB.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const uploadToImgBB = async (filePath) => {
  try {
    // ensure file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found: " + filePath);
    }

    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) throw new Error("IMGBB_API_KEY is not defined in environment");

    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // ImgBB returns uploaded image URL at response.data.data.url
    const imageUrl = response.data?.data?.url;
    if (!imageUrl) throw new Error("ImgBB upload failed: no URL returned");

    // delete local file after successful upload (non-blocking try/catch)
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete local file:", filePath, err.message);
    });

    return imageUrl;
  } catch (err) {
    // bubble up error
    throw err;
  }
};
