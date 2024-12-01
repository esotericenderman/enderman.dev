import { Octokit } from "@octokit/rest";

import privateConfig from "../config/privateConfig.json";

const octokit = new Octokit({
  auth: privateConfig.gitHub.token,
  log: {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  },
});

octokit.rest.users.getAuthenticated().then(console.log).catch(console.error);

const repos: string[] = [];

octokit.rest.repos
  .listForUser({
    username: "EsotericEnderman",
    per_page: 100, // Adjusted to max limit
  })
  .then(({ data }) => {
    data.forEach((repo) => {
      console.log(repo.name);
      repos.push(repo.name);
    });
  })
  .catch((error) => {
    console.error("Error fetching repositories:", error);
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
