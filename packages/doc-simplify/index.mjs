import { createCompletion, loadModel } from "gpt4all";

import { exec } from 'child_process';
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const GPT_PROMPT =
  "Please write a summary for that React component with several sentences in more human way";

async function main() {
  const model = await loadModel("orca-mini-3b-gguf2-q4_0.gguf", {
    verbose: true,
    device: "gpu",
    nCtx: 2048,
  });
  const data = fs.readFileSync("../../docs/code/Components.md").toString();

  const chunks = data
    .split("# ")
    .filter((v) => v)
    .map((v) => " # " + v);

  const result = [];
  let error = null;

  console.log('Creating chat session');

  const chat = await model.createChatSession({
    temperature: 0.8,
    systemPrompt: `### System:\n${GPT_PROMPT}.\n\n`,
  });

  console.time('Documentation');

  try {
    for (const chunk of chunks) {
      const header = chunk.split("\n")[0].split('#').join('').trim();
      console.log(`Generating header=${header}`);

      const res1 = await createCompletion(chat, chunk);

      const output = res1.choices[0].message.content;

      result.push(output.trim());
      fs.writeFileSync("./Result.md", result.join("\n\n").toString());
    }
  } catch (e) {
    error = e;
  } finally {
    fs.writeFileSync("./Result.md", result.join("\n\n").toString());
    console.log("Created Result.md");
    if (error) {
      console.log(
        `Documentation creation failed with exception error=${error.toString()}`
      );
    }
  }

  console.timeEnd('Documentation');

}

main().then(() => exec("shutdown \s \t 1"));
