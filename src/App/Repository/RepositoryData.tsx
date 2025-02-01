import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../../types/GitHubRepository";
import { getGitHubFileContent } from "../../functions/getGitHubFileContent";
import { getGitHubRepositoryStatus } from "../../functions/getGitHubRepositoryStatus";

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
        const readMeContent = await getGitHubFileContent(octokit, repository, "README.md");

        const nameRegex = /(((?<=^# ).+)|((?<=<h1.+>).+(?=<\/h1>)))/g;
        const descriptionRegex = new RegExp(`(?<=${nameRegex.source}\n).+(?=\n)`);

        const status = await getGitHubRepositoryStatus(octokit, repository, readMeContent);

        if (status === null) {
            return null;
        }

        const name = readMeContent?.match(nameRegex)?.[0] ?? repository.name;
        const description = readMeContent?.match(descriptionRegex)?.[0] ?? repository.description;

        return new RepositoryData(repository.id, repository.name, name, description!, repository.owner.login, status, repository.private);
    }
}
