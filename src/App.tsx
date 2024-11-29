import "./App.css";
import "react-scripts";
import profilePicture from "./profile/Assets/ProfilePicture.png";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={profilePicture} className="App-logo" alt="logo" />
        <p>
          Interested in <b>math</b>, <b>coding</b>, and <b>video games</b>.
        </p>
      </header>
    </div>
  );
}
