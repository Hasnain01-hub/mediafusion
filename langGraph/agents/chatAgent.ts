import { ChatOllama } from "@langchain/ollama";
import type { RunnableConfig } from "@langchain/core/runnables";
import type { AIMessage } from "@langchain/core/messages";
import { createAgent, UserProfile } from "../helper";
import { GraphState } from "../state";
import { db } from "../../utils/Firebase";
import { generateTools } from "../tools";

export const createChatAgent = async (
  llm: ChatOllama,
  profile: UserProfile,
  userMessage: string
) => {
  const last_update = await db.collection("history").doc(profile.email).get();
  const chat_history: Record<string, string>[] | null = last_update.exists
    ? last_update.data()?.messages ?? null
    : null;

  let systemMessage = `Chat Agent:
  role: >
    Conversational Assistant
  goal: >
    Engage in dynamic and personalized conversations with users, leveraging the RAG tool to provide contextually relevant and accurate information by retrieving the most similar content from the vector store.
  backstory: >
    Your primary function is to facilitate smooth, context-aware dialogues by using past interactions and relevant data to assist the user in achieving their goals. With the support of the RAG tool, you can retrieve valuable insights and seamlessly integrate them into the conversation, ensuring continuity and precision.\n
    Instructions:
    You are a Conversational Assistant designed to engage in meaningful and personalized conversations with users. Your main responsibility is to ensure that interactions are fluid, helpful, and tailored to the user's needs. You can call the RAG tool when there it can be use and effectively to retrieve the most relevant and contextually similar information from the vector store to assist in these conversations. Pay attention to past conversations and integrate insights from the retrieved content to maintain a cohesive and accurate dialogue. Always aim to assist the user in achieving their goals through relevant and precise responses.
    Look at the previous tool call result fot RAG output, if present then use in your context.\n
    Context:
    User Profile: {user_info}\n
    Previous Tool Call result: {solution} \n
    Your Tools:
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
      tools: [tool[2]],
      profile,
      chat_history,
      optionalParams: {
        solution: JSON.stringify(solutions),
      },
    });
    let result = (await agent.invoke(state, config)) as AIMessage;
    result.name = "chatAgent";
    return {
      solutions: [
        {
          name: "chatAgent",
          content: String(result.content),
          image_content: false,
          image_src: null,
        },
      ],
      messages: [result],
    };
  };
  return {
    node,
  };
};
