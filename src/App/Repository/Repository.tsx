import "../../styles/App/repositories/Repository.css";
import { RepositoryData } from "./RepositoryData";

export default function Repository(repository: RepositoryData) {
  return (
    <div className="repository">
      <a className="repository-name" href={"https://github.com/" + repository.owner + "/" + repository.name}><h3 className="repository-name">{repository.owner}/{repository.displayName}</h3></a>
      <p className={`repository-status repository-status-${repository.status}`}>{repository.status || "unknown"}</p>
      <p className="repository-description">{repository.description}</p>
    </div>
  );
}
