import React, { useState, useEffect } from "react"
import Navbar from "./navbar"
import Feed from "./Feed";
import Explore from "./Explore";
import Activity from "./Activity";
import Lenis from 'lenis'
import { useApi } from "../lib/api";
import { getCookie } from "../lib/utils";
import Create from "./Create";

function Home() {

    const [view, setView] = useState("EXPLORE");

    const { makeRequest } = useApi();

    useEffect(() => {

        //Ensure user has an id cookie. 
        makeRequest("auth/user-id", {
            method: "POST",
            credentials: "include"
        });

    }, []);

    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const views = {
        "FEED": <Feed />,
        "EXPLORE": <Explore />,
        "ACTIVITY": <Activity />,
        "CREATE": <Create />
    }

    //Conditionally render content depending on state.
    return <>
        <Navbar setView={setView} />
        {
            views[view] ?? <Explore />
        }
    </>
}

export default Home;
