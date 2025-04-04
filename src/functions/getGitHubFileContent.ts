import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../types/GitHubRepository";

export async function getGitHubFileContent(octokit: Octokit, repository: GitHubRepository, path: string) {
    let response;
    
    try {
        response = (await octokit.rest.repos.getContent({
            owner: repository.owner.login,
            repo: repository.name,
            path,
        })).data;
    } catch (error) {
        return null;
    }

    if (Array.isArray(response) || response.type !== "file") {
        return null;
    }

    return Buffer.from(response.content!, "base64").toString("utf8");
}
