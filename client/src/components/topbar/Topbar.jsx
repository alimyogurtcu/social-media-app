import React, { useState, useEffect, useContext, useRef } from "react";
import "./topbar.css";
import { Search, Chat, Close, Done } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Topbar() {
  const { user, isFecthing, dispatch } = useContext(AuthContext);
  const searchUsername = useRef();
  const [searched, setSearched] = useState([]);
  const [searching, setSearching] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  function checkSearch() {
    setSearching(searchUsername.current.value);
  }

  useEffect(() => {
    if (searching.length > 0) {
      const search = async () => {
        try {
          const searchResult = await axios.get(`/users?username=${searching}`);
          setSearched([searchResult.data]);
        } catch (error) {
          setSearched([]);
        }
      };
      search();
    }
  }, [searching.length]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Social Media</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            ref={searchUsername}
            onChange={checkSearch}
            placeholder="Search for friend, post or any.."
          />
          <span className="searchInputFoundOrNot">
            {searching.length > 0 ? (
              searched.length > 0 ? (
                <Link
                  to={`/profile/${searchUsername.current.value}`}
                  style={{ textDecoration: "none" }}
                >
                  <Done className="searchInputFound" />
                </Link>
              ) : (
                <Close className="searchInputNotFound" />
              )
            ) : null}
          </span>
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link to={`/messenger`} style={{ textDecoration: "none" }}>
              <Chat style={{ color: "white" }} />
            </Link>
          </div>
        </div>
        <div className="topbarProfile">
          <Link
            to={`/profile/${user.username}`}
            style={{ textDecoration: "none" }}
          >
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "/noAvatar.png"
              }
              alt=""
              className="topbarProfilePicture"
            />
          </Link>
          <span className="topbarUsername">{user.username}</span>
          <span className="topbarLogOut" onClick={logoutHandler}>
            Log Out
          </span>
        </div>
      </div>
    </div>
  );
}
