// scripts/fetch-repos.js
import { Octokit } from "@octokit/rest";
import { mkdirSync, writeFileSync } from "fs";

import privateConfig from "../config/privateConfig.json" with {type: "json"};

const octokit = new Octokit({
  auth: privateConfig.gitHub.token,
});

let page = 0;

async function fetchRepositories() {
  const allRepos = [];

  while (true) {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      page: page,
      affiliation: "owner,collaborator,organization_member",
    });
  
    allRepos.push(...data);
  
    // Break if there's no more data
    if (data.length < 100) break;
  
    page++;
  }
  
  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/repos.json", JSON.stringify(allRepos, null, 2));
}

fetchRepositories().catch(console.error);
