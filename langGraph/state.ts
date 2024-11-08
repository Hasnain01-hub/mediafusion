import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export type AgentResponse = {
  agent_name: string;
  content: string | object | any;
  image_content: boolean;
  image_src: string | null;
};
export const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
    default: () => [],
  }),
  next: Annotation<string>,
  solutions: Annotation<AgentResponse[]>({
    reducer: (x?: AgentResponse[], y?: AgentResponse[]) => y ?? [],
    default: () => [],
  }),
});
