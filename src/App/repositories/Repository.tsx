import "../../styles/App/repositories/Repository.css";

export default function Repository(name: string) {
  return (
    <div className="repository">
      <h2 className="repository-name">{name}</h2>
    </div>
  );
}
