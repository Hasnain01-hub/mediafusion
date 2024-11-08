import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import type { Runnable } from "@langchain/core/runnables";
import type { StructuredTool } from "@langchain/core/tools";
import { Document } from "@langchain/core/documents";
import axios from "axios";
import pg from "pg";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
const { Pool } = pg;

const tunePrompt = (promptMessage: string | undefined) => {
  return (
    promptMessage?.replace(/<\/?[^>]+(>|$)/g, "\n").replace(/<[^>]*>/g, "") ??
    ""
  );
};
export type UserProfile = {
  date: string;
  email: string;
  name: string;
  role: string;
  url: string;
};
export const formatUserProfile = (profile: UserProfile) => {
  return `
    Name: ${profile.name} 
    Email: ${profile.email}
	`;
};
export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

export const createAgent = async ({
  llm,
  systemMessage,
  tools,
  profile,
  chat_history,
  optionalParams,
}: {
  llm: ChatOllama;
  systemMessage: string;
  tools?: StructuredTool[];
  profile: UserProfile;
  chat_history: Record<string, string>[] | null;
  optionalParams?: object;
}): Promise<Runnable> => {
  const toolNames = tools?.map((tool) => tool.name).join(", ") ?? "";

  systemMessage = tunePrompt(systemMessage);

  let prompt = ChatPromptTemplate.fromMessages([
    ["system", `${systemMessage}`],
    // ["system", `user chat history ${chat_history}`],
    new MessagesPlaceholder("messages"),
  ]);

  prompt = await prompt.partial({
    tool_names: toolNames,
    user_info: formatUserProfile(profile),
  });

  if (optionalParams) {
    prompt = await prompt.partial(optionalParams);
  }

  if (tools) return prompt.pipe(llm.bindTools(tools));
  return prompt.pipe(llm);
};

export function getYoutubeVideoId(url: string): string | null {
  // Regular expression to find the video ID
  const regex = /(?<=v=)[\w-]+(?![^&\s])/;

  // Search for the pattern in the URL
  const match = url.match(regex);

  // If match found, return the video ID
  if (match) {
    return match[0];
  } else {
    return null;
  }
}

async function getOllamaEmbedding(text: string): Promise<number[]> {
  try {
    const embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large", // Default value
      baseUrl: "http://localhost:11434", // Default value
    });
    const vectors = await embeddings.embedQuery(text);

    console.log("Embedding from Ollama:", vectors);
    return vectors;
  } catch (error) {
    console.error("Failed to get embedding from Ollama:", error.message);
    throw error;
  }
}
export async function getOllamaSearch(message: string) {
  const embedding = await getOllamaEmbedding(message);
  if (!Array.isArray(embedding)) {
    throw new Error("Embedding is not an array or has incorrect dimensions.");
  }
  const embeddingString = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `
    SELECT id, email,content,
    (embedding <-> $1::vector) AS distance
    FROM fileTable
    ORDER BY distance
    LIMIT 5;
    `,
    [embeddingString]
  );
  return result.rows;
}
export async function setEmbeddedContentUsingOllama(
  combinedContent: Document[],
  email: string
) {
  try {
    const embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large", // Default value
      baseUrl: "http://localhost:11434", // Default value
    });
    const vectors = await embeddings.embedDocuments(
      combinedContent.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );

    if (!vectors || !Array.isArray(vectors)) {
      throw new Error("Invalid embedding format received from Ollama");
    }

    const query = `
    INSERT INTO fileTable (email, embedding,content)
    VALUES ($1, $2::vector, $3)
  `;

    // await pool.query(query, [email, embeddingString]);
    for (let i = 0; i < combinedContent.length; i++) {
      await pool.query(query, [
        email,
        vectors[i], // embedding for the current chunk
        combinedContent[i].pageContent, // original content of the chunk
      ]);
    }
    console.log("Stored successfully.");
  } catch (err) {
    console.error("Failed to store question:", err);
  }
}

export async function queryImageToText(imageData: Buffer) {
  try {
    let header = {
      "Content-Type": "application/octet-stream",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`,
    };
    let url =
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large";
    const response = await axios.post(url, imageData, {
      headers: header,
    });
    console.log(response.data, "response.data");
    return response.data;
  } catch (error) {
    throw new Error("Error querying image-to-text API");
  }
}
