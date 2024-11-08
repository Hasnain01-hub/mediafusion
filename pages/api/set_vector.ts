// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { run } from "../../langGraph/run";
import {
  setEmbeddedContentUsingOllama,
  UserProfile,
} from "../../langGraph/helper";
import { Document } from "@langchain/core/documents";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      email,
      combinedContent,
    }: { email: string; combinedContent: Document[] } = req.body;

    // Ensure both userProfile and userMessage are provided
    if (!email || !combinedContent) {
      return res
        .status(400)
        .json({ error: "Missing userProfile or userMessage." });
    }

    const response = await setEmbeddedContentUsingOllama(
      combinedContent,
      email
    );

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
