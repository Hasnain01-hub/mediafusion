import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { ChatOllama } from "@langchain/ollama";
// import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

import { UserProfile } from "../helper";
// import { JsonOutputParser } from "@langchain/core/dist/output_parsers";

export const createSupervisor = async (
  llm: ChatOllama,
  profile: UserProfile,
  members: string[],
  roles: { [agent: string]: { tasks: string } }
) => {
  // prompt template
  const prompts = "";
  let prompt = ChatPromptTemplate.fromMessages([
    ["system", prompts],
    new MessagesPlaceholder("messages"),
    ["system", "Here are the roles and tasks: {roles} \n for each member"],
    [
      "system",
      `Given the conversation above, who should act next?
			Answer in ONE WORD by selecting one of the following options:  {members}
			Examples:-
			User: I want to create a picture of cat or etc, OR create a Image for rocket, etc
			Answer: imageAgent

			User: Summarize (youtube Link). 
      Backstory: when there is any youtube video link present videoAgent should be used.
			Answer: videoAgent

			User: Give me optimize code for this function, OR Summarize the pdf that I have uploaded. , etc.
      Backstory: This is a general chat agent which helps user to answer the query, it also has rag(
      Retrieval-Augmented Generator) tool which retrieves most similar content from the vector store.
			Answer: chatAgent

			NOTE: '...' means the user may nor may not continue the sentence or say something similar to the topic. do not mistake this as an input.
			`,
    ],
  ]);

  // pass member info
  prompt = await prompt.partial({
    // options: options.join(', '),
    members: members.join(", "),
    roles: JSON.stringify(roles),
  });

  const outputSchema = z.object({
    next: z.string().describe("The selected answer from the options"),
  });

  // const parser = new JsonOutputParser<typeof outputSchema>();

  // const chain = prompt.pipe(llm).pipe(parser);
  const chain = prompt.pipe(llm.withStructuredOutput(outputSchema));
  console.log(chain, "chain");
  return chain;
};
