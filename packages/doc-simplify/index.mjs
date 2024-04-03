import { createCompletion, loadModel } from "gpt4all";

import dotenv from "dotenv";
import { exec } from 'child_process';
import fs from "fs";

dotenv.config();

const GPT_PROMPT =
  "Please write a summary for that Typescript utility description with several sentences in more human way";

async function main() {
  const model = await loadModel("Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf");
  const data = fs.readFileSync("../../docs/code/UTILS.md").toString();

  const chunks = data
    .split("\n# ")
    .map(v => v.trim())
    .filter((v) => v)

  const result = [];
  let error = null;

  console.log('Creating chat session');

  console.time('Documentation');

  try {
    for (const chunk of chunks) {

      const chat = await model.createChatSession({
        temperature: 0.8,
        systemPrompt: `### System:\n${GPT_PROMPT}.\n\n`,
      });

      const header = chunk.split("\n")[0].split('#').join('').trim();
      console.log(`Generating header=${header}`);

      const res1 = await createCompletion(chat, chunk);

      const output = res1.choices[0].message.content;

      result.push([`# ${header}`, '', output.trim()].join('\n'));
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
