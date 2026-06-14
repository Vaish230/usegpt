import { useState } from "react";
import Sidebar from "././components/Sidebar.jsx";
import ChatWindow from "././components/ChatWindow.jsx";
import "./App.css";
import { Context } from "././components/Context.jsx";
import { v1 } from "uuid";
import Auth from "./components/Auth.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(v1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChats, setNewChats] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [showAuth, setShowAuth] = useState(null); // 'login', 'signup', or null
  const [user, setUser] = useState(null);

  const resetChatState = () => {
    setPrevChats([]);
    setNewChats(true);
    setCurrThreadId(v1());
    setReply(null);
    setPrompt("");
  };

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChats,
    setNewChats,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    token,
    setToken,
    showAuth,
    setShowAuth,
    resetChatState,
    user,
    setUser
  };

  return (
    <>
      <Context.Provider value={providerValues}>
        <div className="app">
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
          {showAuth && <Auth />}
        </div>
      </Context.Provider>
    </>
  );
}

export default App;
