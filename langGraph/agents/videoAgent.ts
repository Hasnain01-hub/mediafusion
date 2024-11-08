import { ChatOllama } from "@langchain/ollama";
import type { RunnableConfig } from "@langchain/core/runnables";

import type { AIMessage } from "@langchain/core/messages";
import { GraphState } from "../state";
import { db } from "../../utils/Firebase";
import { createAgent, UserProfile } from "../helper";
import { generateTools } from "../tools";

export const createVideoAgent = async (
  llm: ChatOllama,
  profile: UserProfile,
  userMessage: string
) => {
  const last_update = await db.collection("history").doc(profile.email).get();
  const chat_history: Record<string, string>[] | null = last_update.exists
    ? last_update.data()?.messages ?? null
    : null;

  let systemMessage = `Video Agent:
  role: >
    Video Content Summarizer
  goal: >
    Provide concise and informative summaries of YouTube videos, ensuring that the key points and important details are captured when a user provides a video link.
  backstory: >
    Your task is to analyze the provided YouTube video and extract its essential elements, offering the user a clear and accurate summary. This allows the user to grasp the core content of the video quickly, without needing to watch it in full.\n
    Instructions:
  You are a Video Content Summarizer responsible for delivering clear and concise summaries of YouTube videos in 4-5 lines. When a user provides a YouTube video link, your task is to analyze the video's content using your tools and extract the key points, important details, and relevant information. Present the summary in a way that allows the user to understand the main ideas of the video without having to watch it in full. Ensure the summary is accurate, focused, and easy to grasp, helping the user save time while staying informed.

    Context:
    User Profile: {user_info}\n
    Tools:
    {tool_names}
    `;

  const node = async (
    state: typeof GraphState.State,
    config?: RunnableConfig
  ) => {
    const { solutions } = state;
    const tool = generateTools(solutions);

    const agent = await createAgent({
      llm,
      systemMessage,
      tools: [tool[1]],
      profile,
      chat_history,
    });

    let result = (await agent.invoke(state, config)) as AIMessage;
    result.name = "videoAgent";
    return {
      // solutions: [
      //   {
      //     name: "videoAgent",
      //     content: String(result.content),
      //     image_content: false,
      //     image_src: null,
      //   },
      // ],
      messages: [result],
    };
  };
  return {
    node,
  };
};
