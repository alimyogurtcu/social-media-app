import React, { useContext, useRef } from "react";
import "./share.css";
import {
  PermMedia,
  EmojiEmotions,
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  FavoriteBorder,
  Cancel
} from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

export default function Share() {
  const { user, isFecthing, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [feeling, setFeeling] = useState(null);
  const [showFeeling, setShowFeeling] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      feeling: feeling,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      if (newPost.desc || file) {
        await axios.post("/posts", newPost);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div
      className="share"
      style={
        feeling === null
          ? { border: "1px solid transparent" }
          : feeling === "happy"
          ? { border: "1px solid goldenrod" }
          : feeling === "sad"
          ? { border: "1px solid gray" }
          : feeling === "love"
          ? { border: "1px solid red" }
          : { border: "1px solid transparent" }
      }
    >
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfilePicture"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImageContainer">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="shareImage"
            />
            <Cancel
              className="shareImageCancel"
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form onSubmit={submitHandler} className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <label
              className="shareOption"
              onClick={() => {
                showFeeling === true ? setFeeling(null) : setFeeling(feeling);
                setShowFeeling(!showFeeling);
              }}
            >
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </label>
            {showFeeling ? (
              <>
                <SentimentSatisfiedAlt
                  onClick={() =>
                    feeling !== "happy" ? setFeeling("happy") : setFeeling(null)
                  }
                  style={
                    feeling === "happy"
                      ? { color: "goldenrod" }
                      : { color: "unset" }
                  }
                  className="shareOptionFeeling"
                />
                <SentimentVeryDissatisfied
                  onClick={() =>
                    feeling !== "sad" ? setFeeling("sad") : setFeeling(null)
                  }
                  style={
                    feeling === "sad" ? { color: "gray" } : { color: "unset" }
                  }
                  className="shareOptionFeeling"
                />
                <FavoriteBorder
                  onClick={() =>
                    feeling !== "love" ? setFeeling("love") : setFeeling(null)
                  }
                  style={
                    feeling === "love" ? { color: "red" } : { color: "unset" }
                  }
                  className="shareOptionFeeling"
                />
              </>
            ) : null}
          </div>
          <button className="shareButton" type="submit" disabled={isFecthing}>
          {isFecthing ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Share"
              )}
          </button>
        </form>
      </div>
    </div>
  );
}
