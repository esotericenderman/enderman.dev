import { GitHubOrganisation } from "../types/GitHubOrganisation";
import { GitHubRepository } from "../types/GitHubRepository";
import { GitHubUser } from "../types/GitHubUser";
import config from "../../config/config.json";
import { Octokit } from "@octokit/rest";

export async function isRepositoryOwned(octokit: Octokit, repository: GitHubRepository, owner: GitHubUser | GitHubOrganisation) {
    const user = config.gitHub.userName;

    if (!repository.permissions?.admin) {
        return false;
    }

    if (owner.login === user) {
        return true;
    }

    if (owner.type === "User") {
        return false;
    }

    const org = owner as GitHubOrganisation;

    const admins = (await octokit.orgs.listMembers({org: org.login, role: "admin"})).data;

    if (admins.length >= 2) {
        return false;
    }

    if (admins.length === 0 /* Most likely, my profile does not have permission to "see" who the admin is, which probably means I'm not an admin of the organisation. */) {
        return false;
    }

    const onlyAdmin = admins[0];

    return onlyAdmin.login === user;
}
