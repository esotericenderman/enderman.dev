// scripts/fetch-repos.js
import { Octokit } from "@octokit/rest";
import { mkdirSync, writeFileSync } from "fs";
import { RepositoryData } from "../src/App/Repository/RepositoryData";

import privateConfig from "../config/privateConfig.json" with {type: "json"};
import { GitHubRepository } from "../src/types/GitHubRepository";

const octokit = new Octokit({
  auth: privateConfig.gitHub.token,
});

let page = 0;

async function fetchRepositories() {
  let allRepos: RepositoryData[] = [];

  while (true) {
    const repositories = (await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      page: page,
      affiliation: "owner,collaborator,organization_member",
    })).data as GitHubRepository[];
  
    for (const repo of repositories) {
      if (allRepos.some((r) => r.id === data.id)) continue;

      const data = (await RepositoryData.fromGitHubRepository(repo, octokit))!

      allRepos.push(data);
    }

    // Break if there's no more data
    if (repositories.length < 100) break;
  
    page++;
  }

  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/repos.json", JSON.stringify(allRepos, null, 2));
}

fetchRepositories().catch(console.error);
