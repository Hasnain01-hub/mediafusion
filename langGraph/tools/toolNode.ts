import { ToolMessage, AIMessage } from "@langchain/core/messages";
import type { GraphState } from "../state";
import type { StructuredTool } from "@langchain/core/tools";
import { generateTools } from ".";

type agentName = "call_rag" | "summarize_youtube_video" | "generate_image";
type conditionType = {
  [key in agentName]: {
    content: string;
    image_content: boolean;
    image_src: string | null;
  };
};
export const toolNode = async (state: typeof GraphState.State) => {
  const { solutions, messages } = state;
  const tools = await generateTools(solutions);
  const toolsByName: { [key: string]: StructuredTool } = {
    generate_image: tools[0],
    summarize_youtube_video: tools[1],
    call_rag: tools[2],
  };
  const lastMessage = messages[messages.length - 1] as AIMessage;
  const outputMessages: ToolMessage[] = [];
  let condition: conditionType = {
    generate_image: {
      content: "",
      image_content: false,
      image_src: "",
    },
    summarize_youtube_video: {
      content: "",
      image_content: false,
      image_src: "",
    },
    call_rag: {
      content: "",
      image_content: false,
      image_src: "",
    },
  };

  if (lastMessage.tool_calls?.length) {
    for (const toolCall of lastMessage.tool_calls) {
      try {
        const { solutions } = state;
        const tool = toolsByName[toolCall.name];
        const toolResult = await tool?.invoke(toolCall);
        outputMessages.push(toolResult);
        console.log("toolResult.content&*&%%^%%^", typeof toolResult.content);

        switch (toolCall.name) {
          case "call_rag":
            condition["call_rag"] = {
              content: toolResult.content,
              image_content: false,
              image_src: null,
            };
            break;

          case "summarize_youtube_video":
            condition["summarize_youtube_video"] = {
              content: JSON.parse(toolResult.content).solutions[0].content,
              image_content: false,
              image_src: null,
            };

            break;

          case "generate_image":
            condition["generate_image"] = {
              content: "",
              image_content: true,
              image_src: JSON.parse(toolResult.content).solutions[0].image_src,
            };

            break;

          default:
            console.warn(`Unknown tool called: ${toolCall.name}`);
        }

        solutions.push({
          agent_name: lastMessage.name,
          content: condition[toolCall.name].content,
          image_content: condition[toolCall.name].image_content,
          image_src: condition[toolCall.name].image_src,
        });
      } catch (error: any) {
        // Return the error if the tool call fails
        outputMessages.push(
          new ToolMessage({
            content: error.message,
            name: toolCall.name,
            tool_call_id: toolCall.id!,
            additional_kwargs: { error },
          })
        );
      }
    }
  }
  return { messages: outputMessages };
};
