import { getInput, setFailed, setOutput } from "@actions/core";
import { getOctokit } from "@actions/github";

try {
  const token = getInput("github-token") || process.env.GITHUB_TOKEN;
  const state = getInput("state") || "open";
  const sha = getInput("sha", { required: true });

  const octokit = getOctokit(token);
  const result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    commit_sha: sha,
  });

  const prs = result.data.filter((el) => state === "all" || el.state === state);
  const pr =
    prs.find(({ head }) => context.payload.ref === `refs/heads/${head.ref}`) ||
    prs[0];

  if (pr) {
    setOutput("number", pr.number);
    setOutput("title", pr.title);
    setOutput("body", pr.body);
    setOutput("state", pr.state);
    setOutput("draft", pr.draft);
    setOutput("assignee", pr.assignee?.login);
    setOutput("author", pr.user.login);
  }
} catch (err) {
  setFailed(err.message);
}
