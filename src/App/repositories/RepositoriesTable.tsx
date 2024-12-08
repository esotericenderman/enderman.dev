import repos from "../../data/repos.json";
import Repository from "./Repository";

export default function RepositoriesTable() {
  return repos.sort((a, b) => ((a.private ? 1 : 0) - (b.private ? 1 : 0))).map((repo) => Repository(repo));
}
