import { ExecutionRun, StudioClient } from "@composableai/studio";
import {
  GenerateStory,
  GenerateStoryProps,
  configure,
} from "./interactions.js";

const apiKey = process.env.COMPOSABLE_PROMPTS_API_KEY;
const serverUrl =
  process.env.COMPOSABLE_PROMPTS_SERVER_URL || "http://localhost:8091";
const stream = false;

if (!apiKey) {
  throw new Error("No API key provided.");
}

configure({
  apikey: apiKey,
  serverUrl: serverUrl,
});

const client = new StudioClient({
  apikey: apiKey,
  projectId: "60f1b0a0a9b9a90d2dadbef0",
});

const executionId = "";
const res = await client.interactions.execute(executionId, {
  config: {
    model: "gpt-3.5turbo",
  },
  data: {
    current_doc: "hello world",
  },
});

console.log("Response: ");
console.log(JSON.stringify(res.result, null, 2));

const writer = new GenerateStory();

//
const data: GenerateStoryProps = {
  type: "short story",
  interests: ["video games", "japan", "edo period"],
  length: 800,
  student_age: 17,
  study_language: "english",
  user_language: "english",
  student_name: "John",
};

if (!stream) {
  //blocking execute, wait for the story to be generated
  const story = await writer.execute({
    config: {
      environment: "60f1b0a0a9b9a90d2dadbef0",
      model: "gpt-3.5turbo",
    },
    data: data,
  });
  console.log("Story: \n" + JSON.stringify(story));
} else {
  //let's stream instead
  const onCompleted = (run: ExecutionRun) => {
    console.log("Final Story: ", run.result);
  };

  const onChunk = (chunk: string) => {
    console.log(chunk);
  };

  const story = writer.execute({ data }, onCompleted, onChunk);
}
