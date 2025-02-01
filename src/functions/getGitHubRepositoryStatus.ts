import { Octokit } from "@octokit/rest";
import { GitHubRepository } from "../types/GitHubRepository";
import { GitHubUser } from "../types/GitHubUser";
import { GitHubOrganisation } from "../types/GitHubOrganisation";
import { isRepositoryOwned } from "./isRepositoryOwned";

export async function getGitHubRepositoryStatus(octokit: Octokit, repository: GitHubRepository, readMeContent: string | null) {
    let pullRequests = null;
    let mergedPullRequests = null;

    if (repository.fork) {
        const repoDetails = (await octokit.repos.get({ owner: repository.owner.login, repo: repository.name })).data;

        const upstream = repoDetails.parent;

        if (upstream) {
            console.log(upstream.owner.login, upstream.name);

            const pulls = (
                await octokit.pulls.list({
                    owner: upstream.owner.login,
                    repo: upstream.name,
                    state: "all",
                })
            ).data.filter((pull) => {
                console.log(pull.head.repo?.owner?.login);

                return pull.head.repo?.owner?.login === repository.owner.login;
            });

            pullRequests = pulls;

            const merged = pulls.filter((pull) => pull.state === "closed" && pull.merged_at !== null);

            mergedPullRequests = merged.filter((pull) => pull.base.repo.name === repository.name);
        }
    }


    const total = pullRequests?.length ?? 0;

    if (total !== 0) {
        return null;
    }

    const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained|Unfinished)(?=\]\(.+\))/g;

    const merged = mergedPullRequests?.length ?? 0;

    const owner = repository.owner.login;

    let entity: GitHubUser | GitHubOrganisation = (await octokit.users.getByUsername({ username: owner })).data;

    if (!entity) {
        entity = (await octokit.orgs.get({ org: owner })).data
    }

    const isOwned = isRepositoryOwned(octokit, repository, entity);

    if (!isOwned || (total !== 0 && merged !== 0)) {
        return "contributed";
    }

    if (readMeContent === null) {
        return "unfinished";
    }

    const match = [...readMeContent.matchAll(regex)]?.findLast(() => true)?.[0]?.toLowerCase() ?? "unfinished";
    return match as ProjectStatus;
}
