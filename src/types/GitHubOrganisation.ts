import { RestEndpointMethodTypes } from "@octokit/rest";

export type GitHubOrganisation = RestEndpointMethodTypes["orgs"]["get"]["response"]["data"];
