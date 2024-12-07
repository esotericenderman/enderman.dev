import { RestEndpointMethodTypes } from "@octokit/rest";

/**
 * This is a map of repository names to their status.
 * 
 * This should only be used if the project status cannot be determined from the README.md file.
 */
export const projectStatusMap: {[repositoryName: RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number]["name"]]: ProjectStatus} = {
    EsotericEnderman: "maintained"
}
