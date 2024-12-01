import repos from "../../data/repos.json";

export default function RepositoriesTable() {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Repository Name</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => (
            <tr>
              <td>{repo.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
