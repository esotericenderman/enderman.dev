import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../../types/GitHubRepository";

export class RepositoryData {
    public readonly id: number;
    public readonly name: string;
    public readonly description: string;
    public readonly owner: string;
    public readonly status: ProjectStatus;
    public readonly isPrivate: boolean;

    constructor(id: number, name: string, description: string, owner: string, status: ProjectStatus, isPrivate: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.status = status;
        this.isPrivate = isPrivate;
    }

    public static async fromGitHubRepository(repository: GitHubRepository, octokit: Octokit): Promise<RepositoryData | null> {
        let readmeContent: string | undefined = undefined;

        try {
            const response = await octokit.rest.repos.getContent({
                owner: repository.owner.login,
                repo: repository.name,
                path: "README.md",
            });

            if (Array.isArray(response.data) || response.data.type !== "file") {
                return null;
            }

            readmeContent = Buffer.from(response.data.content!, "base64").toString("utf8");
        } catch (error) {}

        const nameRegex = /((?<=^# ).+|(?<=<h1.+>).+(?=<\/h1>))(?=[\n\r]+)/g;
        const descriptionRegex = new RegExp(`(?<=${nameRegex.source}\n).+(?=\n)`);

        const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained)(?=\]\(.+\))/;

        const status = readmeContent?.match?.(regex)?.[0]?.toLowerCase() as ProjectStatus | undefined;

        const name = repository.private ? "[private]" : readmeContent?.match(nameRegex)?.[0] ?? repository.name;
        const description = repository.private ? "This is a private project, but may be released in the future." : readmeContent?.match(descriptionRegex)?.[0] ?? repository.description;

        return new RepositoryData(repository.id, name, description!, repository.owner.login, status!, repository.private);
    }
}
