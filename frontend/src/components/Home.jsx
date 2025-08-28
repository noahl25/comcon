import React, { useState, useEffect } from "react"
import Navbar from "./navbar"
import Feed from "./Feed";
import Explore from "./Explore";
import Activity from "./Activity";
import { useApi } from "../lib/api";

function Home() {

    const [view, setView] = useState("FEED");

    const { makeRequest } = useApi();

    useEffect(() => {

        //Ensure user has an id cookie. 
        makeRequest("auth/user-id", {
            method: "POST",
            credentials: "include"
        });

    }, []);

    //Conditionally render content depending on state.
    return <div className="">
        <Navbar setView={setView}/>
        {
            view === "FEED" ? <Feed/> : view === "EXPLORE" ? <Explore/> : <Activity/>
        }
    </div>
}

export default Home;
