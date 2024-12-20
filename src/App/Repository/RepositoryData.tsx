import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../../types/GitHubRepository";

export class RepositoryData {
    public readonly id: number;
    public readonly name: string;
    public readonly description: string;
    public readonly status: ProjectStatus;

    constructor(id: number, name: string, description: string, status: ProjectStatus) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
    }

    public static async fromGitHubRepository(repository: GitHubRepository, octokit: Octokit): Promise<RepositoryData | null> {
        const response = await octokit.rest.repos.getContent({
            owner: repository.owner.login,
            repo: repository.name,
            path: "README.md",
        });

        if (Array.isArray(response.data) || response.data.type !== "file") {
            return null;
        }

        const readmeContent = Buffer.from(response.data.content!, "base64").toString("utf8");

        const nameRegex = /((?<=^# ).+|(?<=<h1.+>).+(?=<\/h1>))(?=[\n\r]+)/g;
        const descriptionRegex = new RegExp(`(?<=${nameRegex.source}\n).+(?=\n)`);

        const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained)(?=\]\(.+\))/;

        const status = readmeContent.match(regex)?.[0]?.toLowerCase() as ProjectStatus | undefined;

        const name = (repository.private ? "[private]" : readmeContent.match(nameRegex)?.[0] ?? repository.name);
        const description = (repository.private ? "This is a private project, but may be released in the future." : readmeContent.match(descriptionRegex)?.[0] ?? repository.description);

        return new RepositoryData(repository.id, name, description!, status!);
    }
}
