// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { run } from "../../langGraph/run";
import { UserProfile } from "../../langGraph/helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      userProfile,
      userMessage,
    }: { userProfile: UserProfile; userMessage: string } = req.body;

    // Ensure both userProfile and userMessage are provided
    if (!userProfile || !userMessage) {
      return res
        .status(400)
        .json({ error: "Missing userProfile or userMessage." });
    }

    const response = await run(userProfile, userMessage);

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
