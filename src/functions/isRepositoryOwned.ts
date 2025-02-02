import { GitHubOrganisation } from "../types/GitHubOrganisation";
import { GitHubRepository } from "../types/GitHubRepository";
import { GitHubUser } from "../types/GitHubUser";
import config from "../../config/config.json";
import { Octokit } from "@octokit/rest";

export async function isRepositoryOwned(octokit: Octokit, repository: GitHubRepository, owner: GitHubUser | GitHubOrganisation) {
    console.log(`Checking ownership of repository: ${repository.full_name}`);
    
    const user = config.gitHub.userName;

    console.log(`The script is running for the user: ${user}`);

    if (!repository.permissions?.admin) {
        console.log(`No admin permission has been found. Repository must not be owned.`);
        return false;
    }

    if (owner.login === user) {
        console.log("Repository owner matches the current user, meaning it is owned.");
        return true;
    }

    if (owner.type === "User") {
        console.log("Repository belongs to a different user account, meaning it is not owned.");
        return false;
    }

    const org = owner as GitHubOrganisation;

    console.log(`The repository is owned by the organisation ${org.login}.`);

    console.log(`Organisation roles: `);

    (await octokit.orgs.listOrgRoles({ org: org.login })).data.roles?.forEach((role) => {
        console.log(`Found role: ${role.name}`);
        console.log(`Permissions: ${role.permissions}`);
    })

    const admins = (await octokit.orgs.listMembers({org: org.login, role: "admin"})).data;

    if (admins.length >= 2) {
        console.log("There are 2 or more admins in the organisation. There is no full ownership over this repository.");
        
        console.log("List of admins:");
        admins.forEach((admin) => console.log(admin.login));
        return false;
    }

    if (admins.length === 0 /* Most likely, my profile does not have permission to "see" who the admin is, which probably means I'm not an admin of the organisation. */) {
        console.log("No organisation admins found, likely because of a lack of permissions, counting as repository not owned.");
        return false;
    }

    const onlyAdmin = admins[0];

    console.log(`Only one admin detected in the organisation: ${onlyAdmin.login}`);

    return onlyAdmin.login === user;
}
