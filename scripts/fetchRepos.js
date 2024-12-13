// scripts/fetch-repos.js
import { Octokit } from "@octokit/rest";
import { mkdirSync, writeFileSync } from "fs";

import privateConfig from "../config/privateConfig.json" with {type: "json"};

const octokit = new Octokit({
  auth: privateConfig.gitHub.token,
});

async function fetchRepositories() {
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 1000,
    type: "all"
  });

  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/repos.json", JSON.stringify(data, null, 2));
}

fetchRepositories().catch(console.error);
