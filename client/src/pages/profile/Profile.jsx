import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Topbar from "../../components/topbar/Topbar";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileBlank"></div>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverPicture"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "/noCover.png"
                }
                alt=""
              />
              <img
                className="profileAvatarPicture"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>{" "}
              <span>{user.followers?.length} Followers</span>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <hr className="profileHr"/>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
        <div className="profileBlank"></div>
      </div>
    </>
  );
}
