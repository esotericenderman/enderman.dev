import "../../styles/App/repositories/Repository.css";

export default function Repository(name: string) {
  return (
    <div className="repository">
      <h3 className="repository-name">{name}</h3>
    </div>
  );
}
