import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react';

//Background hover element.
const CursorBackground = ({ state }) => (
    <motion.div animate={state} className='absolute -z-5 rounded-full bg-black top-[3px] bottom-[3px]' />
)

//Induvidual text components in navbar.
const NavbarElement = ({ name, setCursorState, onClick }) => {

    const ref = useRef(null);
    const [initialWidth, setInitialWidth] = useState(0);

    useEffect(() => {
        setInitialWidth(ref.current.getBoundingClientRect().width);
    }, [])

    return <motion.div
        className='w-fit px-3 h-full'
        ref={ref}
        onMouseEnter={() => {
            setCursorState({
                width: initialWidth,
                opacity: 1,
                left: ref.current.offsetLeft,
                scale: 1
            });
        }}
        onClick={onClick}
        whileTap={{
            scale: 0.8,
        }}
    >
        <p className='text-white text-sm md:text-lg mix-blend-difference font-thin cursor-pointer'>
            {name}
        </p>
    </motion.div>
}

function Navbar({ setView }) {

    const [cursorState, setCursorState] = useState({
        width: 0,
        left: 0,
        opacity: 0,
        scale: 1
    });

    return (
        <div className='sticky top-0 w-full h-[100px] bg-stone-100 overflow-hidden gap-5 grid grid-cols-3 items-center border-b-2 border-b-stone-200 z-100'>
            <div className='text-center align-middle w-fit mx-auto'>
                <p className='text-[49px] -translate-y-[3.5px] opacity-0 lg:opacity-100 transition-all duration-300'>comcon</p>
            </div>
            <div onMouseLeave={() => { setCursorState({ ...cursorState, opacity: 0 }) }} className='relative justify-self-center w-fit rounded-full flex border-3 text-lg border-black bg-white py-2 px-1 tracking-wide z-10'>
                <NavbarElement setCursorState={setCursorState} onClick={() => setView("FEED")} name="FEED" />
                <NavbarElement setCursorState={setCursorState} onClick={() => setView("EXPLORE")} name="EXPLORE" />
                <NavbarElement setCursorState={setCursorState} onClick={() => setView("CREATE")} name="CREATE" />
                <NavbarElement setCursorState={setCursorState} onClick={() => setView("ACTIVITY")} name="ACTIVITY" />
                <CursorBackground state={cursorState} />
            </div>
            <Github className='mx-auto cursor-pointer opacity-0 md:opacity-100 transition-all duration-300' size={43} strokeWidth={2} onClick={() => window.open("https://github.com/noahl25/comcon", "_blank")} />
        </div>
    )

}

export default Navbar;