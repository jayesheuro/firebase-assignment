import "./App.css";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";
import { authentication } from "./firebase-config";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
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

  const handleSignOut = () => {
    signOut(authentication)
      .then(() => {
        window.localStorage.removeItem("signin-token");
        setUserData({});
        console.log("Signed out successfully");
      })
      .catch((err) => {
        console.log("Some error occured while signing out :", err);
      });
  };

  return (
    <div className="App">
      <button onClick={handleSignInWithGoogle}>Google Sign In</button>
      <button onClick={handleSignInWithGithub}>Github Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>

      <div className="heroDiv">
        <h1>Here is the landing page for a blog app</h1>
      </div>
    </div>
  );
};
export default App;
