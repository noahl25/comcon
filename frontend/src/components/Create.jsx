import React, { useEffect, useState, useRef } from 'react'
import { cn } from '../lib/utils'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { getCookie, clamp } from '../lib/utils'
import { ArrowLeft, ArrowLeftCircle, ArrowRight } from 'lucide-react'
import { useApi } from '../lib/api'

const Community = ({item, setSelectedCommunity}) => {

  const bgAnimationControls = useAnimationControls();
  const checkAnimationControls = useAnimationControls();

  const onClick = () => { //Start animations on click and add community to cookies.

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
        setSelectedCommunity(item)
    });


  }

  return <motion.div
    className='shadow-lg relative h-fit w-fit overflow-hidden rounded-full grid place-items-center bg-white border-3 border-black py-2 px-3 text-lg cursor-pointer'
    whileHover={{
      scale: 1.05
    }}
    transition={{
      ease: "easeInOut"
    }}
    onClick={onClick}
  >
    <motion.span className='text-black'>{item.toUpperCase()}</motion.span>
    <motion.span initial={{ height: "0%" }} animate={bgAnimationControls} className='absolute left-0 bottom-0 right-0 bg-black'></motion.span>
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check absolute" aria-hidden="true">
      <motion.path animate={checkAnimationControls} d="M4 12 9 17 20 6" initial={{ pathLength: 0, opacity: 0}}></motion.path> 
    </motion.svg> {/* Svg copied from Lucide-React */}
  </motion.div> 
}

const SetCommunity = ({setSelectedCommunity, communities}) => {

    return (
        <div className='w-fit h-fit flex flex-col gap-3 justify-center items-center'>
            <p className='text-3xl'>select a community to post in</p>
            <div className='flex flex-row justify-center items-center gap-2'>
                {
                    communities.map((item) => {
                        return <Community key={item} item={item} setSelectedCommunity={setSelectedCommunity}/>
                    })
                }
            </div>
        </div>
    )
}

const SetPostContent = ({setPostContent, currentPostContent}) => {

    const formRef = useRef(null);

    const onSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(formRef.current);

        setPostContent({
            title: formData.get("title"),
            body: formData.get("body")
        })

    }

    return (
        <form ref={formRef} className='w-full' onSubmit={onSubmit}>
            <p className='text-nowrap text-xl text-center mb-2'>title (required)</p>
            <input required defaultValue={currentPostContent.title} type="text" id="title" name="title" maxLength="75" autoCorrect="off" autoComplete="off" className='focus:outline-none border-3 bg-white shadow-xl rounded-2xl text-left text-nowrap w-full py-2 px-4 text-lg'></input>
            <p className='text-nowrap text-xl text-center mt-3 mb-1'>body (required)</p>
            <div className='border-3 rounded-2xl w-full h-[300px] p-2  shadow-xl'>
              <textarea defaultValue={currentPostContent.body} type="text" id="body" name="body" maxLength="750" autoCorrect="off" autoComplete="off" className='focus:outline-none bg-white text-wrap text-left w-full h-full resize-none px-2 py-1 text-lg'></textarea>
            </div>
            <div className='w-full h-[2px] mt-6 bg-stone-300/80'/>
            <button type="submit" className='w-full flex mt-5 justify-center items-center'>
              <motion.div className='text-xl border-3 shadow-xl py-2 px-3 rounded-full cursor-pointer flex justify-center items-center gap-1' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring" }}>
                <span>Next</span>
                <ArrowRight size={30} className='relative translate-x-[3px] animate-bounce-right'/>
              </motion.div>
            </button>
        </form>
    )
}

const PictureUpload = ({setSelectedImage}) => {

    const formRef = useRef(null);
    const imageRef = useRef(null);

    const [image, setImage] = useState(null);

    const bgAnimationControls = useAnimationControls();
    const checkAnimationControls = useAnimationControls();

    const onSubmit = (e) => {

        e.preventDefault();

        if (image == null) {
            setSelectedImage("none");
        }
        else {
            setSelectedImage(image);
        }

    }

    const onImageAdded = (e) => { //Start animations when image added.

        bgAnimationControls.start({
            height: "100%",
            transition: {
                duration: 0.75,
                ease: "easeInOut"
            }
        });
        checkAnimationControls.start({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: 0.5, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: 0.5, duration: 0.01 },
            },
        });

        setImage(e.target.files[0]);

    }

    return (
        <form ref={formRef} className='w-full' onSubmit={onSubmit}>
            <p className='text-nowrap text-xl text-center mt-3 mb-2'>image (optional)</p>
            <input ref={imageRef} type="file" id="image" name="image" accept="image/*" hidden onChange={onImageAdded} disabled={image != null}></input>
            <div className='w-full flex justify-center items-center mt-3'>
                <motion.label htmlFor="image" className='cursor-pointer text-lg  border-3 shadow-xl py-2 px-3 rounded-full overflow-hidden relative flex items-center justify-center' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring" }}>
                Pick Image
                <motion.span initial={{ height: "0%" }} animate={bgAnimationControls} layout className='absolute left-0 bottom-0 right-0 bg-black'></motion.span>
                <motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check absolute" aria-hidden="true">
                    <motion.path animate={checkAnimationControls} d="M4 12 9 17 20 6" initial={{ pathLength: 0, opacity: 0}}></motion.path> 
                </motion.svg> {/* Svg copied from Lucide-React */}
                </motion.label>
            </div>
            <div className='w-full h-[2px] mt-6 bg-stone-300/80'/>
            <button type="submit" className='w-full flex mt-5 justify-center items-center'>
              <motion.div className='text-xl border-3 shadow-xl py-2 px-3 rounded-full cursor-pointer flex justify-center items-center gap-1' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring" }}>
                <span className='text-2xl'>Post!</span>
              </motion.div>
            </button>
        </form>

    )
}


const BarLoader = () => {

    const variants = {
        initial: {
            scaleY: 0.5,
            opacity: 0,
        },
        animate: {
            scaleY: 1,
            opacity: 1,
            transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1,
            },
        },
    };
    return (
        <motion.div
            transition={{
                staggerChildren: 0.25,
            }}
            initial="initial"
            animate="animate"
            className="flex gap-1"
        >
            <motion.div variants={variants} className="h-12 w-2 bg-black" />
            <motion.div variants={variants} className="h-12 w-2 bg-black" />
            <motion.div variants={variants} className="h-12 w-2 bg-black" />
            <motion.div variants={variants} className="h-12 w-2 bg-black" />
            <motion.div variants={variants} className="h-12 w-2 bg-black" />
        </motion.div>
    );

};

const SubmissionScreen = ({postStatus, goBack}) => {

    const isError = postStatus.includes("Error");

    if (postStatus === "") {
        return <BarLoader/>
    }
    else {
        return (
            <>
                <motion.div 
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    transition={{
                        ease: "easeInOut",
                        duration: 1
                    }}
                    className='text-2xl text-center'
                    style={{ color: isError ? "#9e0000ff" : "#00cb00ff" }}
                >
                    {postStatus}
                    {
                        !isError && <span>! find your post in the activity page.</span>
                    }
                </motion.div>
                {

                    isError && <motion.div className='w-full flex mt-5 justify-center items-center'
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        transition={{
                            ease: "easeInOut",
                            duration: 1
                        }}
                        onClick={goBack}
                    >
                        <motion.div className='text-xl border-3 shadow-xl py-2 px-3 rounded-full cursor-pointer flex justify-center items-center gap-1' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring" }}>
                        <span className='text-xl'>
                            Go Back
                        </span>
                        </motion.div>
                    </motion.div>
                }
            </>
        )

    }

}

const ProgressMarker = ({number, finished, progressBar = false}) => {

    const bgAnimationControls = useAnimationControls();
    const checkAnimationControls = useAnimationControls();
    const progressAnimationControls = useAnimationControls();

    const animate = () => {
        bgAnimationControls.start({
            height: "100%",
            transition: {
                ease: "easeInOut",
                duration: 1
            }
        });
        checkAnimationControls.start({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: 0.5, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: 0.5, duration: 0.01 },
            },
        });
        progressAnimationControls.start({
            width: "100%",
            transition: {
                ease: "easeInOut",
                duration: 1
            }
        });
    }

    const reverse = () => {
        bgAnimationControls.start({
            height: "0%",
            transition: {
                ease: "easeInOut",
                duration: 1,
                delay: 0.5
            }
        });
        checkAnimationControls.start({
            pathLength: 0,
            opacity: 0,
            transition: {
                pathLength: { delay: 0, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: 1.5, duration: 0.01 },
            },
        });
        progressAnimationControls.start({
            width: "0%",
            transition: {
                ease: "easeInOut",
                duration: 1,
                delay: 0.5
            }
        });
    }

    useEffect(() => {

        if (finished) {
            animate();
        }
        else {
            reverse();
        }

    }, [finished])

    return (
        <div className={cn('flex justify-between items-center', progressBar ? "grow" : "")}>
            <div className='size-[60px] outline-4 border-black rounded-full relative overflow-hidden grid place-items-center cursor-pointer'>
                <span className='text-xl font-semibold'>{number}</span>
                <motion.div animate={bgAnimationControls} className='absolute bottom-0 left-0 right-0 bg-black'></motion.div>
                <motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check absolute" aria-hidden="true">
                    <motion.path animate={checkAnimationControls} d="M4 12 9 17 20 6" initial={{ pathLength: 0, opacity: 0}}></motion.path> 
                </motion.svg> {/* Svg copied from Lucide-React */}
            </div>
            { progressBar && 
            
                <div className='h-[4px] grow bg-stone-400/80 mx-5 rounded-full relative'>
                    <motion.div animate={progressAnimationControls} className='absolute bg-black bottom-0 top-0 left-0'></motion.div>
                </div> 
            
            }
        </div>
    )
}

const ProgressTracker = ({finished}) => {

    return (
        <div className='w-full h-[60px] mx-auto flex justify-between items-center'>

            {
                [1, 2, 3].map((item) => {
                    return <ProgressMarker key={item} number={item} progressBar={item == 3 ? false : true} finished={item <= finished}/>
                })
            }

        </div>
    )
}

function Create() {

    //States for all information about a post.
    const [finishedIndex, setFinishedIndex] = useState(0);
    const [selectedCommunity, setSelectedCommunity] = useState("");
    const [postContent, setPostContent] = useState({
        title: "",
        body: ""
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [postStatus, setPostStatus] = useState("");

    const [communities, setCommunities] = useState([]);

    const { makeRequest } = useApi();

    const post = () => {

        //Add all info to form data and send to backend.
        const data = new FormData();

        if (selectedImage !== "none") {
            data.append("image", selectedImage);
        }

        data.append("title", postContent.title)
        data.append("body", postContent.body);
        data.append("community", selectedCommunity);

        makeRequest("create/create-post", {
            method: "POST",
            body: data,
            credentials: "include"
        }).then((response) => {
            setPostStatus(response.status);
        });

    }

    useEffect(() => {
        // Get joined communities.
        const cookies = getCookie(document, "communities")
        let list = [];
        if (cookies) {
            list = cookies.split(",");
            if (list[list.length - 1].length === 0)
            list.pop()
            setCommunities(list);
        }

    }, [])

    useEffect(() => {

        if (selectedCommunity) {
            setFinishedIndex(1);
        }
        if (postContent.title || postContent.text) {
            setFinishedIndex(2);
        }
        if (selectedImage != null) {
            setFinishedIndex(3);
            post();
        }

    }, [selectedCommunity, postContent, selectedImage]); // Increment completion whenever one of the important states change.

    const goBack = () => {

        if (finishedIndex - 1 == 0) {
            setSelectedCommunity("");
            setPostContent({
                title: "",
                body: ""
            });
        }
        else if (finishedIndex - 1 == 2) {
            setSelectedImage(null);
        }
        
        setFinishedIndex(prev => ( clamp(prev - 1, 0, 2)) );
    }

    const steps = {
        0: <SetCommunity setSelectedCommunity={setSelectedCommunity} communities={communities}/>,
        1: <SetPostContent setPostContent={setPostContent} currentPostContent={postContent}/>,
        2: <PictureUpload setSelectedImage={setSelectedImage}/>,
        3: <SubmissionScreen postStatus={postStatus} goBack={goBack}/>
    }

    if (communities.length !== 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ease: "easeInOut", duration: 1 }} className="w-[100dvw] overflow-hidden h-[calc(100vh-100px)]">
                <div className='w-2/3 lg:w-4/11 flex items-center justify-center mx-auto mt-40'>
                    <ProgressTracker finished={finishedIndex}/>
                </div>
                <div className='w-2/3 lg:w-4/11 flex flex-col justify-start gap-5 items-center mx-auto mt-7'>
                    <AnimatePresence>
                        <motion.div
                            key={finishedIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { ease: "easeInOut", duration: 1, delay: 1 } }}
                            exit={{ opacity: 0 }}
                            transition={{ ease: "easeInOut", duration: 1 }}
                            className="w-full grid place-items-center"
                        >
                            {
                                steps[finishedIndex] ?? <p>an error occured.</p>
                            }
                        </motion.div>
                        {
                            (finishedIndex > 0 && finishedIndex < 3) && 
                            <motion.div
                                key="goback"
                                className='absolute bottom-15 cursor-pointer flex justify-center items-center gap-1' 
                                onClick={goBack}
                                initial={{
                                    opacity: 0
                                }}
                                animate={{
                                    opacity: 1
                                }}
                                exit={{
                                    opacity: 0
                                }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 1
                                }}
                            >
                                <ArrowLeft className='' size={27}/>
                                <span className='text-lg relative translate-y-[1px]'>Go Back</span>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </motion.div>
        )
    }
    else {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ease: "easeInOut", duration: 1 }} className="w-[100dvw] h-[calc(100vh-100px)] flex justify-center items-center">
                <p className='text-lg'>join a community in the explore page before posting!</p>
            </motion.div>
        )
    }
}

export default Create;