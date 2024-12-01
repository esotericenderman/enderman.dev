import repos from "../../data/repos.json";
import Repository from "./Repository";

export default function RepositoriesTable() {
  return repos.map((repo) => Repository(repo));
}
