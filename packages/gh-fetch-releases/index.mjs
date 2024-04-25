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

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

const releaseText = releaseList.flatMap(({
    html_url,
    name,
    tag_name,
    body,
    published_at
}) => [
    `# ${name} (v${tag_name}, ${formatDate(published_at)})\n\n`,
    `> Github [release link](${html_url})\n\n`,
    `${body}\n\n`,
    "\n\n",
]).join("");

fs.writeFileSync("./Result.md", releaseText)
