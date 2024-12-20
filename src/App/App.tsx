import "../styles/App/App.css";
import profilePicture from "../assets/profile/Assets/Profile Picture.png";
import ProjectList from "./Repository/ProjectList";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={profilePicture} className="App-logo" alt="logo" />
        <p>
          Interested in <b>math</b>, <b>coding</b>, and <b>video games</b>.
        </p>
        <ProjectList />
      </header>
    </div>
  );
}
