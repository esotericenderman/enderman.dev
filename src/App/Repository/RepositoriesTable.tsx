import repos from "../../data/repos.json";
import Repository from "./Repository";
import { RepositoryData } from "./RepositoryData";

export default function RepositoriesTable() {
  return repos.sort((a, b) => ((a.isPrivate ? 1 : 0) - (b.isPrivate ? 1 : 0))).map((repo) => Repository(repo as RepositoryData));
}
