import React, { useState } from "react"
import Navbar from "./navbar"
import Feed from "./Feed";
import Explore from "./Explore";

function Home() {

    const [view, setView] = useState("FEED");

    //Conditionally render content depending on state.
    return <>
        <Navbar setView={setView}/>
        {
            view === "FEED" ? <Feed/> : <Explore/>
        }
    </>
}

export default Home;
