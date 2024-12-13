// scripts/fetch-repos.js
import { Octokit } from "@octokit/rest";
import { mkdirSync, writeFileSync } from "fs";

import privateConfig from "../config/privateConfig.json" with {type: "json"};

const octokit = new Octokit({
  auth: privateConfig.gitHub.token,
});

async function fetchRepositories() {
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    username: "EsotericEnderman",
    per_page: 1000,
    type: "all"
  });

  const foundationRepos = await octokit.rest.repos.listForAuthenticatedUser({
    username: "EsotericFoundation",
    per_page: 1000,
    type: "all"
  });

  const tssRepos = await octokit.rest.repos.listForAuthenticatedUser({
    username: "TheSlimySwamp",
    per_page: 1000,
    type: "all"
  });

  const slimeSmpRepos = await octokit.rest.repos.listForAuthenticatedUser({
    username: "SlimeSMP",
    per_page: 1000,
    type: "all"
  });

  const templatesRepos = await octokit.rest.repos.listForAuthenticatedUser({
    username: "EsotericTemplates",
    per_page: 1000,
    type: "all"
  });

  data.push(...foundationRepos.data, ...tssRepos.data, ...slimeSmpRepos.data, ...templatesRepos.data);

  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/repos.json", JSON.stringify(data, null, 2));
}

fetchRepositories().catch(console.error);
