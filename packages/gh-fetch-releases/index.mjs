import { Octokit } from "octokit";
import fs from "fs";

const octokit = new Octokit();

const { data: releaseList } = await octokit.request('GET /repos/react-declarative/react-declarative/releases', {
    owner: 'OWNER',
    repo: 'REPO',
    per_page: 99999999,
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
})

const releaseText = releaseList.flatMap(({
    html_url,
    name,
    tag_name,
    body
}) => [
    `# ${name} (${tag_name})\n`,
    `> Github [release link](${html_url})\n`,
    `${body}\n`,
    "\n\n",
]).join("");

fs.writeFileSync("./Result.md", releaseText)
