import "../../styles/App/repositories/Repository.css";
import { RepositoryData } from "./RepositoryData";

export default function Repository(repository: RepositoryData) {
    return (
        <div className="repository">
            <a className="repository-link" href={"https://github.com/" + repository.owner + "/" + repository.name}>
                <p className="repository-name">
                    <h3 className="repository-name">{repository.displayName}</h3>
                </p>
                <p className={`repository-status repository-status-${repository.status}`}>{repository.status || "unknown"}</p>
            </a>
        </div>
    );
}
