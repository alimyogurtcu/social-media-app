import React, { useContext } from "react";
import { PriorityHigh, PermMedia, Cancel } from "@material-ui/icons";
import "./rightbar.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Rightbar({ user }) {
  const desc = useRef();
  const username = useRef();
  const city = useRef();
  const from = useRef();
  const relationship = useRef();
  const email = useRef();
  const password = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [followers, setFollowers] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState();
  const [settingsShow, setSettingsShow] = useState(false);
  const [settingsSecurityShow, setSettingsSecurityShow] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [checkConversation, setCheckConversation] = useState(false);

  useEffect(async () => {
    setFollowed(currentUser.followings.includes(user?._id));
    const check = await axios.get(
      "/conversations/find/" + currentUser?._id + "/" + user?._id
    );
    if (check.data !== null) setCheckConversation(!checkConversation);
  }, [user?._id]);

  useEffect(() => {
    if (user?._id !== undefined) {
      const getFollowers = async () => {
        try {
          const followerList = await axios.get("/users/friend/" + user._id);
          setFollowers(followerList.data);
        } catch (error) {
          console.log(error);
        }
      };
      getFollowers();
    }
  }, [user]);

  const followHandler = async () => {
    try {
      if (followed) {
        await axios.put("/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put("/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  const settingsHandler = async () => {
    setSettingsShow(!settingsShow);
    setSettingsSecurityShow(false);
  };

  const securityHandler = async () => {
    setSettingsSecurityShow(!settingsSecurityShow);
  };

  const messageHandler = async () => {
    const members = {
      senderId: currentUser._id,
      receiverId: user._id,
    };
    const check = await axios.get(
      "/conversations/find/" + currentUser._id + "/" + user._id
    );
    if (check.data === null) await axios.post("/conversations/", members);
    setCheckConversation(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete("/users/" + currentUser._id + "/" + "true");
      localStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
  };

  const informationUpdate = async () => {
    var localUser = JSON.parse(localStorage.getItem("user"));
    const newInformation = {
      userId: currentUser._id,
      desc: desc.current.value,
      username: username.current.value,
      information: {
        city: city.current.value,
        from: from.current.value,
        relationship: relationship.current.value,
      },
    };

    if (profilePicture) {
      const data = new FormData();
      const fileName = Date.now() + profilePicture.name;
      data.append("name", fileName);
      data.append("file", profilePicture);
      newInformation.profilePicture = fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }

    if (coverPicture) {
      const data = new FormData();
      const fileName = Date.now() + coverPicture.name;
      data.append("name", fileName);
      data.append("file", coverPicture);
      newInformation.coverPicture = fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }

    if (settingsSecurityShow) {
      newInformation.email = email.current.value;
      newInformation.password = password.current.value;
      try {
        await axios.put("/users/" + currentUser._id, newInformation);
        setSettingsSecurityShow(!settingsSecurityShow);
        setSettingsShow(!settingsShow);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await axios.put("/users/" + currentUser._id, newInformation);
      if (localUser && localUser.username === newInformation.username) {
        localUser.information.city = newInformation.information.city;
        localUser.information.from = newInformation.information.from;
        localUser.information.from = newInformation.information.from;
        localUser.desc = newInformation.desc;
        localUser.username = newInformation.username;
        localUser.profilePicture = newInformation.profilePicture;
        localUser.coverPicture = newInformation.coverPicture;
        localUser.email = newInformation.email;
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(localUser));
        window.location.reload();
      } else {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <PriorityHigh htmlColor="tomato" className="birthdayIcon" />
          <span className="birthdayText">
            <b>Lorem, ipsum </b>dolor <b>sit amet</b> consectetur adipisicing
            elit. Eaque, dolorum.
          </span>
        </div>
        <img className="rightbarAd" src="https://picsum.photos/2000" alt="" />
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username ? (
          <>
            <button className="rightbarFollowButton" onClick={followHandler}>
              {followed ? "Unfollow" : "Follow"}
            </button>
            <button
              className="rightbarMessageButton"
              onClick={messageHandler}
              disabled={checkConversation}
            >
              {checkConversation ? "Already Messaging" : "Starting Messaging"}
            </button>
          </>
        ) : (
          <>
            <button
              className="rightbarSettingsButton"
              onClick={settingsHandler}
            >
              {settingsShow ? "Cancel" : "Settings"}
            </button>
            {settingsShow ? (
              <>
                <button
                  className="rightbarSettingsConfrimButton"
                  onClick={informationUpdate}
                >
                  Confirm
                </button>
                <button
                  className="rightbarSettingsSecurityButton"
                  onClick={securityHandler}
                >
                  {settingsSecurityShow ? "Close Security" : "Change Security"}
                </button>
                {settingsSecurityShow && (
                  <Link to={"/login"}>
                    <button
                      className="rightbarSettingsSecurityButton"
                      onClick={deleteUser}
                    >
                      Delete User
                    </button>
                  </Link>
                )}
              </>
            ) : null}
          </>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              {settingsShow ? (
                <input
                  ref={city}
                  defaultValue={user.information?.city || "Unspecified"}
                ></input>
              ) : (
                user.information?.city || "Unspecified"
              )}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">
              {settingsShow ? (
                <input
                  ref={from}
                  defaultValue={user.information?.from || "Unspecified"}
                ></input>
              ) : (
                user.information?.from || "Unspecified"
              )}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {settingsShow ? (
                <input
                  ref={relationship}
                  defaultValue={user.information?.relationship || "Unspecified"}
                ></input>
              ) : (
                user.information?.relationship || "Unspecified"
              )}
            </span>
          </div>
          {settingsShow && (
            <>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Username:</span>
                <span className="rightbarInfoValue">
                  <input ref={username} defaultValue={user.username}></input>
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Description:</span>
                <span className="rightbarInfoValue">
                  <input ref={desc} defaultValue={user.desc}></input>
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Profile Picture</span>
                <span className="rightbarInfoValue">
                  <label htmlFor="profilePicture" className="pictureOption">
                    <PermMedia htmlColor="tomato" className="pictureIcon" />
                    <span className="pictureOptionText">Select Photo</span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="profilePicture"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                  </label>
                </span>
                {profilePicture && (
                  <div className="shareImageContainer">
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt=""
                      className="shareImage"
                    />
                    <Cancel
                      className="shareImageCancel"
                      onClick={() => setProfilePicture(null)}
                    />
                  </div>
                )}
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Cover Picture</span>
                <span className="rightbarInfoValue">
                  <label htmlFor="coverPicture" className="pictureOption">
                    <PermMedia htmlColor="tomato" className="pictureIcon" />
                    <span className="pictureOptionText">Select Photo</span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="coverPicture"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => setCoverPicture(e.target.files[0])}
                    />
                  </label>
                </span>
                {coverPicture && (
                  <div className="shareImageContainer">
                    <img
                      src={URL.createObjectURL(coverPicture)}
                      alt=""
                      className="shareImage"
                    />
                    <Cancel
                      className="shareImageCancel"
                      onClick={() => setCoverPicture(null)}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {settingsSecurityShow && (
            <>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">New Email:</span>
                <span className="rightbarInfoValue">
                  <input ref={email} defaultValue={user.email}></input>
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">New Password:</span>
                <span className="rightbarInfoValue">
                  <input ref={password}></input>
                </span>
              </div>
            </>
          )}
        </div>
        <h4 className="rightbarTitle">
          Followings ({user.followings?.length})
        </h4>
        <div className="rightbarFollowings">
          {followers.map((follower) => (
            <Link
              to={"/profile/" + follower.username}
              key={follower._id}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    follower.pofilePicture
                      ? PF + follower.profilePicture
                      : PF + "/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingProfilePicture"
                />
                <span className="rightbarFollowingName">
                  {follower.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
