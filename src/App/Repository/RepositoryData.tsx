export class RepositoryData {

    public readonly name: string;
    public readonly description: string;
    public readonly status: ProjectStatus;

    constructor(name: string, description: string, status: ProjectStatus) {
        this.name = name;
        this.description = description;
        this.status = status;
    }
}
