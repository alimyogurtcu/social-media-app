import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./post.css";
import { DeleteForever, Favorite, FavoriteBorder } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PostComment from "../postComment/PostComment";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState(post.comments);
  const [commentUser, setCommentUser] = useState();
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
    comment.map(async (comment) => {
      const res = await axios.get(`/users?userId=${comment.userId}`);
      setCommentUser(res.data);
    });
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (error) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deletePost = async () => {
    try {
      await axios.delete("/posts/" + post._id + "/" + currentUser._id);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="post"
      style={
        post.feeling === null
          ? { border: "1px solid transparent" }
          : post.feeling === "happy"
          ? { border: "1px solid goldenrod" }
          : post.feeling === "sad"
          ? { border: "1px solid gray" }
          : post.feeling === "love"
          ? { border: "1px solid red" }
          : { border: "1px solid transparent" }
      }
    >
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfilePicture"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId === currentUser._id && (
              <DeleteForever
                className="postDeleteButton"
                htmlColor="tomato"
                onClick={deletePost}
              />
            )}
          </div>
        </div>
        <div className="postCenter">
          {post.desc && <span className="postText">{post.desc}</span>}
          {post.img && <img src={PF + post.img} alt="" className="postImage" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <Favorite className="likedIcon" onClick={likeHandler} />
            ) : (
              <FavoriteBorder className="likeIcon" onClick={likeHandler} />
            )}
            <span className="likeCounter">{like}</span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => setShowComments(!showComments)}
            >
              {post.comments.length ? post.comments.length : "0"} comments
            </span>
          </div>
        </div>
      </div>
      {showComments && (
        <PostComment
          post={post}
          comments={post.comments}
          username={commentUser}
        />
      )}
    </div>
  );
}
