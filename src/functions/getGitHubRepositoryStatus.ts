import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../types/GitHubRepository";
import { GitHubUser } from "../types/GitHubUser";
import { GitHubOrganisation } from "../types/GitHubOrganisation";
import { isRepositoryOwned } from "./isRepositoryOwned";

export async function getGitHubRepositoryStatus(octokit: Octokit, repository: GitHubRepository, readMeContent: string | null) {
    console.log(`Calculating project status for GitHub repository: ${repository.full_name}`);
    console.log(`README.md file exists: ${readMeContent !== null}`);

    let pullRequests = null;
    let mergedPullRequests = null;

    if (repository.fork) {
        console.log("Repository is a fork.");

        const repoDetails = (await octokit.repos.get({ owner: repository.owner.login, repo: repository.name })).data;

        const upstream = repoDetails.parent!!;

        console.log(`Found upstream repository: ${upstream.full_name}`);
        console.log(`Looking through pull requests...`);

        const pulls = (
            await octokit.pulls.list({
                owner: upstream.owner.login,
                repo: upstream.name,
                state: "all",
            })
        ).data.filter((pull) => {
            console.log(`Found pull request ${pull.number}`);

            const owner = pull.head.repo?.owner?.login;

            console.log(`Owner: ${owner}`);

            return pull.head.repo?.owner?.login === repository.owner.login;
        });

        pullRequests = pulls;

        const merged = pulls.filter((pull) => pull.state === "closed" && pull.merged_at !== null);

        mergedPullRequests = merged.filter((pull) => pull.base.repo.name === repository.name);
    }

    const total = pullRequests?.length ?? 0;

    console.log(`Total number of my pull requests: ${total}`);

    if (total !== 0) {
        console.log(`The current repository only exists to create pull requests for the upstream, disregarding...`);
        return null;
    }

    const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained|Unfinished)(?=\]\(.+\))/g;

    const merged = mergedPullRequests?.length ?? 0;

    console.log(`Number of merged pull requests: ${merged}`);

    const owner = repository.owner.login;

    console.log(`Current repository owner: ${owner}`);

    let entity: GitHubUser | GitHubOrganisation = (await octokit.users.getByUsername({ username: owner })).data;

    if (!entity) {
        entity = (await octokit.orgs.get({ org: owner })).data
    }

    const isOwned = isRepositoryOwned(octokit, repository, entity);

    console.log(`Repository is owned: ${isOwned}`);

    if (!isOwned || (total !== 0 && merged !== 0)) {
        console.log(`Current repository has only been contributed to... setting status as contributed.`);
        return "contributed";
    }

    if (readMeContent === null) {
        console.log("No README.md content specified, counting repository as unfinished.");
        return "unfinished";
    }

    const match = [...readMeContent.matchAll(regex)]?.findLast(() => true)?.[0]?.toLowerCase() ?? "unfinished";
    return match as ProjectStatus;
}
