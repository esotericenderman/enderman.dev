import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../../types/GitHubRepository";

export class RepositoryData {
    public readonly id: number;
    public readonly name: string;
    public readonly displayName: string;
    public readonly description: string;
    public readonly owner: string;
    public readonly status: ProjectStatus;
    public readonly isPrivate: boolean;

    constructor(id: number, name: string, displayName: string, description: string, owner: string, status: ProjectStatus, isPrivate: boolean) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.owner = owner;
        this.status = status;
        this.isPrivate = isPrivate;
    }

    public static async fromGitHubRepository(repository: GitHubRepository, octokit: Octokit): Promise<RepositoryData | null> {
        let readmeContent = "";

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

        const nameRegex = /(((?<=^# ).+)|((?<=<h1.+>).+(?=<\/h1>)))/g;
        const descriptionRegex = new RegExp(`(?<=${nameRegex.source}\n).+(?=\n)`);

        const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained|Unfinished)(?=\]\(.+\))/g;

        const isOwned = repository.permissions?.admin ?? false;

        let status = (!isOwned ? "contributed" : [...readmeContent.matchAll(regex)]?.findLast(() => true)?.[0]?.toLowerCase() ?? "unfinished") as ProjectStatus;

        const name = readmeContent?.match(nameRegex)?.[0] ?? repository.name;
        const description = readmeContent?.match(descriptionRegex)?.[0] ?? repository.description;

        return new RepositoryData(repository.id, repository.name, name, description!, repository.owner.login, status, repository.private);
    }
}
