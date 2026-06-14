import React, { PureComponent } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { Context } from "./Context.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChats,
    allThreads,
    setAllThreads,
    token,
    setToken,
    setShowAuth,
    resetChatState, setUser, user
  } = useContext(Context);

  const dropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    resetChatState();
    setUser(null);
    setIsOpen(false);
  };

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChats(false);

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        alert("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log(data);
      setReply(data.reply);

      if (token && !allThreads.some((t) => t.threadId === currThreadId)) {
        setAllThreads((prev) => [
          {
            threadId: currThreadId,
            title: prompt.slice(0, 40),
          },
          ...prev,
        ]);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(reply);
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <span>
            UseGPT &nbsp;<i className="fa-solid fa-chevron-down"></i>
          </span>
          {!token ? (
            <div className="navbarAuthButtons">
              <button className="navbarBtn login" onClick={() => setShowAuth("login")}>Log In</button>
              <button className="navbarBtn signup" onClick={() => setShowAuth("signup")}>Sign Up</button>
            </div>
          ) : (
            <div className="userIconDiv" onClick={dropdown}>
              <i className="fa-solid fa-user"></i>
            </div>
          )}
        </div>
        {isOpen && token && (
          <div className="dropDown">
            <div className="dropDownItem">
              <i className="fa-solid fa-arrow-trend-up fa-sm"></i>&nbsp;&nbsp;
              Upgrade Plan
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-diagram-project fa-sm"></i>
              &nbsp;&nbsp; Customize Chats
            </div>
            <div className="dropDownItem">
              <i className="fa-solid fa-gear fa-sm"></i>&nbsp;&nbsp; Settings
            </div>
            <div className="dropDownItem" onClick={logout}>
              <i className="fa-solid fa-arrow-right-from-bracket fa-sm"></i>
              &nbsp;&nbsp;Log out
            </div>
          </div>
        )}

        <div className="chatMessagesContainer"> <Chat></Chat></div>

        <ScaleLoader color="#fff" id="loader" loading={loading}></ScaleLoader>

        <div className="chatInput">
          <div className="inputBox">
            <input
              placeholder="Ask Anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
            ></input>
            <div id="submit" onClick={getReply}>
              <i className="fa-notdog fa-solid fa-arrow-up fa-flip-horizontal"></i>
            </div>
          </div>
          <p className="info">
            UseGPT can make mistakes. Check important info. See Cookie
            Preferences.
          </p>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
