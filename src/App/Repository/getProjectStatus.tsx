import { RestEndpointMethodTypes } from "@octokit/rest";
import { projectStatusMap } from "./projectStatusMap";

export function getProjectStatus(repo: RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][number], readMe: string): ProjectStatus | undefined {
    const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained)(?=\]\(.+\))/;

    return (readMe.match(regex)?.[0]?.toLowerCase() ?? projectStatusMap[repo.name]) as ProjectStatus | undefined;
}
