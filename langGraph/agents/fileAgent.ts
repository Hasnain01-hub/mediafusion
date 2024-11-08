//not in use
// import { createAgent } from "$lib/server/ai/graphs/chatting/agents";

// import type { RunnableConfig } from "@langchain/core/runnables";

// import type { Profile } from "$lib/supabase";

// import type { AIMessage } from "@langchain/core/messages";
// import { GraphState } from "../state";
// import { db } from "../../utils/Firebase";

// export const createMentor = async (
//   llm: AzureChatOpenAI,
//   profile: Profile,
//   userMessage: string
// ) => {
//   const last_update = await db.collection("history").doc(profile.email).get();
//   const chat_history: Record<string, string>[] | null = last_update.exists
//     ? last_update.data()?.messages ?? null
//     : null;

//   let systemMessage = "";

//   const agent = await createAgent({
//     llm,
//     systemMessage,
//     profile,
//     chat_history,
//   });

//   return {
//     node: async (state: typeof GraphState.State, config?: RunnableConfig) => {
//       let result = (await agent.invoke(state, config)) as AIMessage;
//       result.name = "mentor";
//       return {
//         messages: [result],
//       };
//     },
//     agent,
//   };
// };
