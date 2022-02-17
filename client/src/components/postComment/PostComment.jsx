import "./postComment.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function PostComment({ comments, post, username }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [comment, setComment] = useState([]);
  const commentText = useRef();
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setComment(comments);
  }, [comments]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const sendDate = new Date();
    const newComment = {
      userId: currentUser._id,
      text: commentText.current.value,
      sendingDate: sendDate,
    };
    try {
      if (newComment.text) {
        try {
          axios.put("/posts/" + post._id + "/comment", newComment);
          setComment((comment) => [...comment, newComment]);
          commentText.current.value = "";
        } catch (error) {}
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="comments">
      <hr className="commentsHr" />
      {comment.map((comment) => (
        <>
          <div className="commentsComment">
            <Link
              to={`/profile/${username.username}`}
              style={{ textDecoration: "none" }}
            >
              <img
                className="commentsProfilePicture"
                src={
                  comment.profilePicture
                    ? PF + comment.profilePicture
                    : PF + "/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <div className="commentsUserInfo">
              {username.username} ·{" "}
              <span className="commentsDate">
                {format(comment.sendingDate)}
              </span>
            </div>
            <span className="commentsText">{comment.text}</span>
          </div>
        </>
      ))}
      <form onSubmit={submitHandler} className="commentSend">
        <input
          placeholder="Your comment"
          className="commentsInput"
          rows="2"
          ref={commentText}
        />
        <button className="commentSendButton" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
