import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { db } from "../utils/Firebase";
import { UserProfile } from "./helper";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

import { ChatOllama } from "@langchain/ollama";
import { createGraph } from "./index";
import "dotenv/config";

// run method called by frontend
export const run = async (profile: UserProfile, userMessage: string) => {
  // get today's chat message history
  //     await memory.getTodaysChatMessageHistory(profile);
  const todaysChatMessageHistory = new InMemoryChatMessageHistory();
  // add user message to chat message history
  const userInput = new HumanMessage({
    id: crypto.randomUUID(),
    content: userMessage,
    name: "user",
  });
  await todaysChatMessageHistory.addMessage(userInput);

  const llm = new ChatOllama({
    model: "llama3",
    baseUrl: process.env.OLLAMA_BASE_URL,
  });

  // create graph
  const data = await createGraph(llm, profile, userMessage);

  if (!data) return;

  const { graph, config } = data;

  // get today's chat history
  const messages: BaseMessage[] = await todaysChatMessageHistory.getMessages();

  // get all chat history
  // const messages: BaseMessage[] = await chatMessageHistory.getMessages()

  // graph config
  // temporarily removed

  // run graph as stream
  const stream = await graph.invoke(
    { messages },
    {
      ...config,
      streamMode: "values",
    }
  );
  console.log("Finished loop", stream["solutions"]);
  return stream["solutions"];
};
const call = async () => {
  let profileDoc = await db
    .collection("users")
    .doc("hasnainsayyed833@gmail.com")
    .get();

  if (profileDoc.exists) {
    const profileData = profileDoc.data() as UserProfile; // Cast data to UserProfile type
    await run(profileData, "create an image for cat");
  } else {
    console.error("No such user profile found!");
  }
};
// call();
