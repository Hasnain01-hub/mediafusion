// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { queryImageToText } from "../../langGraph/helper";

// Set up multer for file storage
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set limit to 5MB
});

// Middleware to handle file uploads
const uploadMiddleware = upload.single("image");
export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    uploadMiddleware(req as any, res as any, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "Error uploading file." });
      }
      if (!req.file) {
        console.error("No file uploaded.");
        return res.status(400).json({ error: "No file uploaded." });
      }
      console.log("called&*&*&");
      try {
        const imageData = req.file.buffer;
        const output = await queryImageToText(imageData);

        return res.status(200).json({ response: output[0].generated_text });
      } catch (error) {
        console.error("Error in API handler:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
