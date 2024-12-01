import { Octokit } from "@octokit/rest";

import * as privateConfig from "../config/privateConfig.json" with {type: "json"};

const octokit = new Octokit({
  authStrategy: privateConfig.gitHub.password
});

const repos: string[] = [];

octokit.rest.repos
  .listForUser({
    username: "EsotericEnderman",
    per_page: 1000
  })
  .then(({ data }) => {
    data.forEach((repo) => {
      console.log(repo.name);
      repos.push(repo.name);
    });
  });

console.log(repos);

export default function RepositoriesTable() {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Repository Name</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => (
            <tr>
              <td>{repo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
