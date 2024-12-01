import { useEffect, useState } from "react";
import { RestEndpointMethodTypes } from "@octokit/rest";
import "../../styles/App/repositories/Repository.css";

export default function Repository(repository: RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number]) {
  const [readmeText, setReadmeText] = useState<string>("");

  useEffect(() => {
    async function fetchReadme() {
      try {
        let response = await fetch("https://raw.githubusercontent.com/EsotericEnderman/" + repository.default_branch + "/refs/heads/main/README.md");
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
      <h3 className="repository-name">{repository.name}</h3>
      <pre className="repository-readme">{readmeText}</pre>
    </div>
  );
}
