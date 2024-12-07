export function getProjectStatus(readMe: string): ProjectStatus | undefined {
    const regex = /(?<=!\[Project Status: )(Abandoned|Completed|Maintained)(?=\]\(.+\))/;

    return readMe.match(regex)?.[0] as ProjectStatus | undefined;
}
