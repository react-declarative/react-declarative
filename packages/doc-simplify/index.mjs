import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const GPT_PROMPT = 'Please write a summary for that React component with several sentences:';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function main() {

  const data = fs.readFileSync('../../docs/code/Components.md').toString();

  const chunks = data.split('# ').filter(v => v).map(v => " # "+v);

  const result = [];
  let error = null;

  try {
    for (const chunk of chunks) {
        const header = chunk.split('\n')[0].trim();
        console.log(`Generating header=${header}`)
        const content = [GPT_PROMPT, chunk].join('\n');
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content }],
            model: 'gpt-3.5-turbo',
        });
        const result = chatCompletion.choices[0].message;
        result.push([header, result].join('\n'));
      }
  } catch (e) {
    error = e;
  } finally {
    fs.writeFileSync('./Result.md', result.join('\n\n').toString());
    console.log('Created Result.md');
    if (error) {
        console.log(`Documentation creation failed with exception error=${error.toString()}`);
    }
  }

}

main();