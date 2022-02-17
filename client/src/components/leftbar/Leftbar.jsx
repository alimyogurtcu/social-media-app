import React from "react";
import "./leftbar.css";
import { PriorityHigh } from "@material-ui/icons";

export default function Leftbar() {
  return (
    <div className="leftbar">
      <div className="leftbarWrapper">

      <div className="birthdayContainer">
        <PriorityHigh htmlColor="tomato" className="birthdayIcon" />
        <span className="birthdayText">
          <b>Lorem, ipsum </b>dolor <b>sit amet</b> consectetur adipisicing
          elit. Eaque, dolorum.
        </span>
      </div>
      <img className="leftbarAd" src="https://picsum.photos/2000" alt="" />
      </div>
    </div>
  );
}
