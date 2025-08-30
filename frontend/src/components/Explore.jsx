import { CirclePlus, Search, Check } from 'lucide-react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, use } from 'react'
import { getCookie, randomRange } from '../lib/utils';
import { useApi } from "../lib/api";

const TypewriterTextComponent = ({examples, showExamples, exampleIndex, setExampleIndex}) => {

  const letterDelay = 0.05;
  const boxFade = 0.125;

  const fadeDelay = 4;
  const mainFade = 0.25;

  const swapDelay = 4500;

  useEffect(() => {
    const id = setInterval(() => {
      setExampleIndex(prev => (prev + 1) % examples.length); //Change example every swapDelay milliseconds.
    }, swapDelay);

    return () => clearInterval(id);
  });

  //Render each letter induvidually with component over it.
  if (showExamples) {
    return (
      <motion.div layout className='absolute top-0 left-1/2 -translate-x-1/2 h-full w-10 z-10 pointer-events-none text-stone-400 flex justify-center items-center text-lg text-center text-nowrap align-center'>
        {examples[exampleIndex].split("").map((letter, index) => {
          return <motion.span key={`${exampleIndex}-${index}`} className='relative'
            initial={{ opacity: 1 }} 
            animate={{ opacity: 0 }} 
            transition={{ delay: fadeDelay, duration: mainFade, ease: "easeInOut" }}
          > 
            <motion.span
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: index * letterDelay, duration: 0 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ times: [0, 0.1, 1], delay: index * letterDelay, duration: boxFade, ease: "easeInOut" }} 
              className='absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-stone-600'>
            </motion.span>
          </motion.span>
        })}
      </motion.div>
    )
  }
}

const Community = ({item, setCommunities}) => {

  const bgAnimationControls = useAnimationControls();
  const checkAnimationControls = useAnimationControls();

  const onClick = () => { //Start animations on click and add community to cookies.

    const oldCookie = getCookie(document, "communities") || "";
    const newCookie = oldCookie + item;
    document.cookie = `communities=${newCookie},; max-age=2592000`

    bgAnimationControls.start({
      height: "100%",
      transition: {
        duration: 0.75,
        ease: "easeInOut"
      }
    })
    checkAnimationControls.start({
      pathLength: 1,
      opacity: 1,
      transition: {
          pathLength: { delay: 0.5, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay: 0.5, duration: 0.01 },
      },
    }).then(() => {
      setTimeout(() => {
        setCommunities(prev => prev.filter(i => i != item));
      }, 250)
    })

  }

  return <motion.div 
    layout 
    className='relative h-fit overflow-hidden rounded-full grid place-items-center bg-white border-3 border-black py-2 px-3 text-lg cursor-pointer'
    initial={{
      scale: 1,
      opacity: 0
    }}
    animate={{
      opacity: 1,
      transition: {
        opacity: {
          duration: 1,
          delay: 1
        }
      }
    }}
    whileHover={{
      scale: 1.1
    }}
    transition={{
      ease: "easeInOut"
    }}
    exit={{
      scale: 0,
      transition: {
        duration: 0.5
      }
    }}
    onClick={onClick}
  >
    <span className='text-black'>{item.toUpperCase()}</span>
    <motion.span initial={{ height: "0%" }} animate={bgAnimationControls} layout className='absolute left-0 bottom-0 right-0 bg-black'></motion.span>
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check absolute" aria-hidden="true">
      <motion.path animate={checkAnimationControls} d="M4 12 9 17 20 6" initial={{ pathLength: 0, opacity: 0}}></motion.path> 
    </motion.svg> {/* Svg copied from Lucide-React */}
  </motion.div> 
}

const Communities = ({mediumDevice, currentSearch}) => {

  const { makeRequest } = useApi();

  const [communities, setCommunities] = useState([]);

  useEffect(() => {

    makeRequest(`explore/get-communities?q=${currentSearch == "" ? "random" : currentSearch}`, {
      method: "GET"
    }).then((data) => {
      setCommunities(data.names);
    });

  }, [currentSearch]);

  if (communities.length >= 0) {

    return <motion.div style={{ width: mediumDevice ? '50%' : '30%' }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { visualDuration: 1000 } }} className='flex-none mx-auto mt-3 flex flex-wrap gap-2 justify-center items-start'>
      <AnimatePresence>
        {
          communities.map((item, index) => (
            <Community key={`${item}`} item={item} setCommunities={setCommunities}/>
          ))
        }
        <motion.p layout initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { opacity: { duration: 1, delay: 1.7, ease: "easeInOut" } } }} className='text-lg w-full text-center mt-[3px] h-fit'>click any community to join it</motion.p> 
      </AnimatePresence>
    </motion.div>

  }
  else {
    return <motion.div style={{ width: mediumDevice ? '50%' : '30%' }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { visualDuration: 1000 } }} className='h-50 flex flex-wrap gap-2 justify-center items-start'>
    </motion.div>
  }

}

function Explore() {

  const [mediumDevice, setIsMediumDevice] = useState(window.innerWidth < 768);
  const [showExamples, setShowExamples] = useState(true);

  const examples = [
    "Robotics",
    "Politics",
    "Architecture",
    "Photography",
    "Stuffed Animals"
  ]

  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {

    const handleResize = () => {
      if (mediumDevice && window.innerWidth > 768)
        setIsMediumDevice(false);
      if (!mediumDevice && window.innerWidth < 768)
        setIsMediumDevice(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [mediumDevice]);

  const [currentSearch, setCurrentSearch] = useState("");

  return (
    <div className='w-[100dvw] h-[calc(100vh-100px)]'>
      <div className='flex justify-center items-center flex-col gap-5 bg-stone-50 pt-[calc(38vh-100px)]'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { visualDuration: 1000 } }} className='text-nowrap text-5xl text-bold tracking-wide'>find your place</motion.div>
        <motion.div transition={{ visualDuration: 100, type: "spring" }} animate={{ width: mediumDevice ? '70%' : '45%' }} className='h-[50px] border-3 border-black rounded-full flex gap-2 justify-start items-center flex-row bg-white'>
          <Search className='ml-3' strokeWidth={3}/>
          <div className='relative grow'>
            <TypewriterTextComponent examples={examples} showExamples={showExamples} exampleIndex={exampleIndex} setExampleIndex={setExampleIndex}/>
            <form>
              <input type="text" id="name" name="name" maxLength="75" autoCorrect="false" autoComplete="off" onChange={(e) => setCurrentSearch(e.target.value) } className='focus:outline-none text-center w-full text-lg' onClick={ () => { setShowExamples(false); } } onBlur={ () => { setShowExamples(currentSearch == ""); setExampleIndex(randomRange(0, examples.length - 1)); } }/>
            </form>
          </div>
          <CirclePlus className='mr-3 ml-auto cursor-pointer' size={28} strokeWidth={2}/>
        </motion.div>
      </div>
      <Communities currentSearch={currentSearch} mediumDevice={mediumDevice}/>
    </div>
  )
}

export default Explore;