import { useEffect, useState } from "react";
import { RestEndpointMethodTypes } from "@octokit/rest";
import "../../styles/App/repositories/Repository.css";
import { getProjectStatus } from "./getProjectStatus";

export default function Repository(repository: RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number]) {
  const [readmeText, setReadmeText] = useState<string>("Loading README.md...");
  console.log(readmeText);

  const nameRegex = /(?<=^# ).+(?=\n)|(?<=<h1.+>).+(?=<\/h1>)/g;
  const descriptionRegex = new RegExp(`(?<=${nameRegex.source}\n).+(?=\n)`);

  const projectStatus = getProjectStatus(readmeText);

  const name = (repository.private ? "[private]" : readmeText.match(nameRegex)?.[0] ?? repository.name);
  const description = (repository.private ? "This is a private project, but may be released in the future." : readmeText.match(descriptionRegex)?.[0] ?? repository.description);

  useEffect(() => {
    async function fetchReadme() {
      try {
        let response = await fetch("https://raw.githubusercontent.com/" + repository.owner.login + "/" + repository.name + "/refs/heads/" + repository.default_branch + "/README.md");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setReadmeText(text);
      } catch (error) {
        console.error("Error fetching README.md:", error);
      }
    }
    fetchReadme();
  }, []);

  return (
    <div className="repository">
      <h3 className="repository-name">{name}</h3>
      <p className="repository-status">{projectStatus}</p>
      <p className="repository-description">{description}</p>
    </div>
  );
}
