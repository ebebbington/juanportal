import React, { ReactElement } from "react";
import { useState, useEffect, useReducer } from "react";
import Button from "../button/button";
import openSocket from "socket.io-client";
const socket = openSocket("http://0.0.0.0:9002");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const classes = require("./Chat.module.css");

const Chat = (): ReactElement => {
  socket.removeAllListeners();

  const [messageToSend, setMessageToSend] = useState("");

  const [messagesReceived, setMessagesReceived] = useReducer(
    (
      messages,
      {
        type,
        username,
        message,
      }: { type: string; username: string; message: string }
    ) => {
      if (type === "add") {
        return [...messages, { username, message }];
      } else {
        return messages;
      }
    },
    []
  );

  const [username, setUsername] = useState("");

  const [usersOnline, setUsersOnline] = useReducer(
    (users, { type, newList }: { type: string; newList: string[] }) => {
      if (type === "add") {
        return newList;
      } else {
        return users;
      }
    },
    []
  );

  const [showUsers, setShowUsers] = useState(false);

  const handleSend = (): void => {
    console.log("Clicked send! Your message is: " + messageToSend);
    if (messageToSend) {
      console.log("Gonna send your message");
      socket.emit("chat message", username, messageToSend);
      setMessageToSend("");
      const inputElem = document.querySelector("input");
      if (inputElem) inputElem.value = "";
    }
  };

  window.onbeforeunload = function (): void {
    socket.emit("user left", username);
  };

  const handleWSUsersOnline = (newUserList: string[]): void => {
    setUsersOnline({ type: "add", newList: newUserList });
  };

  const handleLeave = (): void => {
    console.log("Clicked leave!");
    if (confirm("Are you sure you want to leave?")) {
      console.log("Gonna leave");
      window.location.href = "/";
    }
  };

  const handleMouseEnterOnStatus = (): void => {
    console.log("[handleMouseEnterOnStatus]");
    setShowUsers(true);
  };

  const handleMouseLeaveOnStatus = (): void => {
    console.log("[handleMouseLeaveOnStatus]");
    setShowUsers(false);
  };

  const handleWSChatMessage = (username: string, message: string): void => {
    console.log("[handleChatMessage]");
    console.log(username, message);
    setMessagesReceived({ type: "add", username: username, message: message });
  };

  const handleInputKeyPress = (event: React.MouseEvent): void => {
    // Click the submit button when pressing enter
    if (event.keyCode === 13) {
      const submitButton: HTMLElement =
        document.querySelector(".footer > button");
      if (submitButton) submitButton.click();
    }
  };

  useEffect((): void => {
    // Means it's a first time user
    if (!username) {
      const un = prompt("Your username:") || "Guest User";
      setUsername(un);
      console.log("Sending a user joined message with username: " + un);
      socket.emit("user joined", un);
    }
    // Initialise our handlers for received messages
    socket.on("chat message", handleWSChatMessage);
    socket.on("users online", handleWSUsersOnline);
  });

  return (
    <div className={classes.chatHolder}>
      <div className={classes.header}>
        <div className={classes.status}>
          <i
            className="fa fa-circle"
            onMouseEnter={handleMouseEnterOnStatus}
            onMouseLeave={handleMouseLeaveOnStatus}
          />
          {showUsers && (
            <ul className="userList">
              {usersOnline.map((username: string, index: number) => (
                <li key={index}>{username}</li>
              ))}
            </ul>
          )}
          <p>{usersOnline.length} online</p>
        </div>
        <h2>{username}</h2>
      </div>
      <div className={classes.body}>
        {messagesReceived.map(
          (message: { username: string; message: string }, index: number) => (
            <div key={index}>
              <strong>
                <p>{message.username}</p>
              </strong>
              <p>{message.message}</p>
            </div>
          )
        )}
      </div>
      <div className={classes.footer}>
        <label htmlFor="message" hidden>
          Message
        </label>
        <input
          id="message"
          type="text"
          placeholder="Type something => ENTER"
          className="messageInput form-control"
          onChange={(event): void => setMessageToSend(event.target.value)}
          onKeyPress={(event): void => handleInputKeyPress(event)}
        />
        <Button text="Send" lightColour="green" clickHandler={handleSend} />
        <Button text="Leave" lightColour="red" clickHandler={handleLeave} />
      </div>
    </div>
  );
};

export default Chat;
