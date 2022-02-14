import "./App.css";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { authentication } from "./firebase-config";
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./screens/Dashboard";

function App() {
  const [userData, setUserData] = useState({});
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={<Landing userData={userData} setUserData={setUserData} />}
        />
        <Route path="dashboard" element={<Dashboard userData={userData} />} />
      </Routes>
    </BrowserRouter>
  );
}

const Landing = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res) => {
        console.log(res);
        window.localStorage.setItem("signin-token", res.user.accessToken);
        setUserData(res.user);
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  const handleSignInWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res) => {
        console.log(res);
        window.localStorage.setItem("signin-token", res.user.accessToken);

        setUserData(res.user);
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <div className="navbar">
        <div className="title">Firebase Assignment - Blog App</div>
        <div className="buttons">
          <button onClick={handleSignInWithGoogle}>Google Sign In</button>
          <button onClick={handleSignInWithGithub}>Github Sign In</button>
        </div>
        <div className="name">-Jayesh Singh</div>
      </div>
      div
      {/* <button onClick={handleSignOut}>Sign Out</button> */}
      <div className="heroDiv">
        <h1>Here is the landing page for a blog app</h1>
      </div>
      <div className="footer">Quantiphi SD - J2J Batch 2022</div>
    </div>
  );
};
export default App;
