import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { z } from "zod";
import dynamic from "next/dynamic";
import axios from "axios";
import { AgentResponse } from "../state";
import { getOllamaSearch, getYoutubeVideoId } from "../helper";
import { BaseMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";


const importDynamic = new Function("modulePath", "return import(modulePath)");

export function generateTools(solutions: AgentResponse[]) {
  const createImage = tool(
    async (data, config) => {
      const { image_description } = data;

      let url =
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

      const response = await axios.post(
        url,
        {
          inputs: image_description,
          options: {
            wait_for_model: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`, // Replace with your token
          },
          responseType: "arraybuffer",
        }
      );

      const image_data = await response.data;

      console.log("imag eis here*(*(*(*(", JSON.stringify(image_data));
      solutions = [
        {
          agent_name: "imageAgent",
          content: "",
          image_content: true,
          image_src: image_data,
        },
      ];
      return {
        solutions,
      };
    },
    {
      name: "generate_image",
      description: `Generate an image based on user prompt`,
      schema: z
        .object({
          image_description: z
            .string()
            .describe("Short Image description to be generated"),
        })
        .describe(
          "image_description: short description of the image to be generated"
        ),
    }
  );

  const summarizeVideo = tool(
    async (data, config) => {
      const { video_link } = data;

      const id = getYoutubeVideoId(video_link);
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: "snippet",
            id: id,
            key: process.env.NEXT_PUBLIC_YOUTUBE_API,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch video details: ${response.statusText}`
        );
      }

      const apiData = response.data;
      const title: string = apiData.items[0].snippet.title;
      const channelName: string = apiData.items[0].snippet.channelTitle;
      const description: string = apiData.items[0].snippet.description;

      console.log(title, channelName, description);
      const llm = new ChatOllama({
        model: "llama3",
        baseUrl: process.env.OLLAMA_BASE_URL,
      });
      let prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a professional summarizer. Summarize the following youtube video.`,
        ],
        [
          "system",
          `Context: \nYoutube video Title: ${title}\n Channel Name: ${channelName}\n description: ${description}`,
        ],
        [
          "system",
          `Based on the Given context, understand and summarize it in 3-4 lines`,
        ],
        // new MessagesPlaceholder("messages"),
      ]);
      // prompt.pipe(llm);
      const llmResponse = await prompt.pipe(llm).invoke({});
      solutions = [
        {
          agent_name: "videoAgent",
          content: String(llmResponse.content),
          image_content: false,
          image_src: null,
        },
      ];
      return { solutions };
    },
    {
      name: "summarize_youtube_video",
      description: `Summarize the youtube video based on video link entered`,
      schema: z
        .object({
          video_link: z.string().describe("youtube video link"),
        })

        .describe("video_link: youtube video link, that user has inputted"),
    }
  );
  const callRag = tool(
    async (data, config) => {
      const { user_input } = data;
      console.log("user_input^&%^%^%^%", user_input);
      const callRag = await getOllamaSearch(user_input);
      console.log(callRag, "callRag**(*((");

      return callRag;
    },
    {
      name: "call_rag",
      description: `Get the reference content from vector store for the user input.`,
      schema: z
        .object({
          user_input: z.string().describe("user input"),
        })
        .describe("user_input: user input, that user has inputted"),
    }
  );
  return [createImage, summarizeVideo, callRag];
}
// export { createImage, summarizeVideo };

// async function test() {
//   const callRag = await getpinecone("hello there");
//   console.log(callRag, "callRag**(*((");
// }
// test();
