import { RestEndpointMethodTypes } from "@octokit/rest";

export type GitHubUser = RestEndpointMethodTypes["users"]["getByUsername"]["response"]["data"];
