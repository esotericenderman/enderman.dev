import { RestEndpointMethodTypes } from "@octokit/rest";

export type GitHubRepository = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number];
