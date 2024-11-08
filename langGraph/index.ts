import { END, Graph, START, StateGraph } from "@langchain/langgraph";

// import type { AzureChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import type { AIMessage } from "@langchain/core/messages";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import { toolNode } from "./tools/toolNode";
import { createSupervisor } from "./agents/supervisor";
import { createChatAgent } from "./agents/chatAgent";
import { createImageAgent } from "./agents/imageAgent";
import { createVideoAgent } from "./agents/videoAgent";
import type { RunnableConfig } from "@langchain/core/runnables";
import { UserProfile } from "./helper";
import { GraphState } from "./state";

export const createGraph = async (
  llm: ChatOllama,
  profile: UserProfile,
  userMessage: string
) => {
  // Graph members with roles under supervisor
  const members = ["imageAgent", "videoAgent", "chatAgent"];
  const roles: { [agent: string]: { tasks: string } } = {
    imageAgent: {
      tasks: "imageAgent is used to create/generate an image, which user wants",
    },

    videoAgent: {
      tasks:
        "videoAgent is used to summarize the youtube video, if user has provided a youtube video link",
    },
    chatAgent: {
      tasks:
        "chatAgent is a default agent for chat, it also has rag tool, which retrieves most similar content from the vector store.",
    },
  };

  const supervisor = await createSupervisor(llm, profile, members, roles);
  const chatAgent = await createChatAgent(llm, profile, userMessage);
  const imageAgent = await createImageAgent(llm, profile, userMessage);
  const videoAgent = await createVideoAgent(llm, profile, userMessage);

  // create graph
  const workflow = new StateGraph(GraphState)
    // nodes
    .addNode("supervisor", supervisor)
    .addNode("chatAgent", chatAgent.node)
    .addNode("imageAgent", imageAgent.node)
    .addNode("videoAgent", videoAgent.node)
    .addNode("tool_node", toolNode)
    //edges
    .addConditionalEdges("supervisor", (x: typeof GraphState.State) => x.next)
    // .addEdge("imageAgent", END)
    .addConditionalEdges("chatAgent", agentRouter)
    .addConditionalEdges("imageAgent", agentRouter)
    .addConditionalEdges("videoAgent", agentRouter)
    .addConditionalEdges("tool_node", toolRouter)
    .addEdge(START, "supervisor");

  let config: RunnableConfig = {
    configurable: {
      thread_id: "2",
    },
    recursionLimit: 25,
  };

  return { graph: workflow.compile(), config };
};

const toolRouter = (state: typeof GraphState.State) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.name == "call_rag") {
    return "chatAgent";
  }
  return END;
};

const agentRouter = (state: typeof GraphState.State) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // let content = lastMessage.content as string;
  if (lastMessage?.tool_calls && lastMessage?.tool_calls.length > 0) {
    return `tool_node`;
  }

  return END;
};
