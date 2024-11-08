import type { RunnableConfig } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import type { AIMessage } from "@langchain/core/messages";
import { GraphState } from "../state";
import { db } from "../../utils/Firebase";
import { createAgent, UserProfile } from "../helper";
import { generateTools } from "../tools";

export const createImageAgent = async (
  llm: ChatOllama,
  profile: UserProfile,
  userMessage: string,
  few_shot: boolean = true
) => {
  const last_update = await db.collection("history").doc(profile.email).get();
  const chat_history: Record<string, string>[] | null = last_update.exists
    ? last_update.data()?.messages ?? null
    : null;

  let systemMessage = `Image Agent:
  role: >
    Image Creator
  goal: >
    Generate high-quality images based on the user's request, ensuring that the visual output aligns with the user's specifications and desired style.
  backstory: >
    Your task is to interpret the user's description and create an image that accurately reflects their vision. Whether the user requires an illustration, a realistic depiction, or a creative concept, you should focus on delivering visually appealing and relevant images that meet their expectations.\n
    Instructions:
    You are an Image Creator tasked with generating high-quality images based on user requests. When the user provides a description or specific instructions for an image, your responsibility is to call your tools to interpret their vision accurately and create an image that meets their specifications. Pay close attention to the requested details, style, and desired output, whether it is an illustration, a realistic depiction, or a conceptual piece.\n
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
      tools: [tool[0]],
      profile,
      chat_history,
    });
    let result = (await agent.invoke(state, config)) as AIMessage;
    result.name = "imageAgent";
    return {
      // solutions: [
      //   {
      //     name: "imageAgent",
      //     content: String(result.content),
      //     image_content: false,
      //     image_src: null,
      //   },
      // ],
      messages: [result],
    };
  };
  return {
    node: node,
  };
};
