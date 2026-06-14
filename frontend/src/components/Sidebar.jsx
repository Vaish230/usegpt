import React, { PureComponent, useState, useEffect } from "react";
import "./Sidebar.css";
import { Context } from "./Context";
import { useContext } from "react";
import { v1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setNewChats,
    setPrompt,
    setReply,
    setPrevChats,
    token,
    setToken,
    setShowAuth,
    user,
    setUser
  } = useContext(Context);

  const getAllThreads = async () => {
    if (!token) {
      setAllThreads([]);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        setAllThreads([]);
        return;
      }

      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (e) {
      console.log(e);
    }
  };

  const newChat = () => {
    setNewChats(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(v1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    if (!token) return;
    try {
      const thread = await fetch(`http://localhost:5000/api/thread/${newThreadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (thread.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        return;
      }
      const res = await thread.json();
      console.log(res);
      setPrevChats(res.messages);
      setNewChats(false);
      setReply(null);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteThread = async (threadId) => {
    if (!token) return;
    try {
      const thread = await fetch(
        `http://localhost:5000/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (thread.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        return;
      }
      const response = await thread.json();
      console.log(response);

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );
      if (threadId === currThreadId) {
        setNewChats(true);
        setPrevChats([]);
        setReply(null);
        setPrompt("");
        setCurrThreadId(v1());
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId, token]);

  return (
    <>
      <section className="sidebar">
        <div className="sideone">
          <img src="/logo.png" alt="logo" className="logo" />
        </div>
        <ul className="iconss">
          <li onClick={newChat}>
            <i className="fa-regular fa-pen-to-square"></i>{" "}
            &nbsp;&nbsp;&nbsp;New Chat
          </li>

          <li>
            <i className="fa-brands fa-algolia"></i>
            &nbsp;&nbsp;&nbsp;Search Chat
          </li>
          <li>
            <i className="fa-solid fa-layer-group"></i>
            &nbsp;&nbsp;&nbsp;Library
          </li>
          <li>
            <i className="fa-solid fa-briefcase"></i>
            &nbsp;&nbsp;&nbsp;Projects
          </li>
          <li>
            <i className="fa-brands fa-simplybuilt"></i>
            &nbsp;&nbsp;&nbsp;Apps
          </li>
        </ul>

        {!token ? (
          <div className="sidebarAuthPrompt">
            <h4>Save chat history</h4>
            <p>Sign up or log in to sync your conversation history and keep your chats saved.</p>
            <div className="sidebarAuthButtons">
              <button className="sidebarBtn signup" onClick={() => setShowAuth("signup")}>Sign Up</button>
              <button className="sidebarBtn login" onClick={() => setShowAuth("login")}>Log In</button>
            </div>
          </div>
        ) : (
          <ul className="history">
            {allThreads?.map((thread, idx) => (
              <li
                key={idx}
                onClick={() => changeThread(thread.threadId)}
                className={thread.threadId === currThreadId ? "highlighted" : " "}
              >
                {thread.title}
                <i
                  className="fa-solid fa-trash fa-xm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                ></i>
              </li>
            ))}
          </ul>
        )}

        <div className="sign">{token && user?.username ? <div className="username"><i className="fa-solid fa-user"></i>&nbsp;&nbsp;&nbsp;{user.username}</div> : "Welcome"}</div>
      </section>
    </>
  );
}

export default Sidebar;
