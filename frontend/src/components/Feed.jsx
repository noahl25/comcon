import { Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls, useInView } from "framer-motion";
import { cn, getCookie } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../lib/api";

const Post = ({communityName, communityImage, date, title, image, text, likes}) => {

  const [likeClicked, setLikeClicked] = useState(false);

  const postRef = useRef(null);
  const inView = useInView(postRef, { once: false, amount: 0.1 });
  const postAnimation = useAnimationControls();

  useEffect(() => {

    if (inView) {
      postAnimation.start({
        opacity: 1,
        transition: {
          ease: "easeInOut",
          duration: 0.8
        }
      });
    }
    else {
      postAnimation.start({
        opacity: 0,
        transition: {
          ease: "easeInOut",
          duration: 0.8
        }
      });
    }


  }, [inView]);

  console.log(image);

  return (
    <motion.div
      ref={postRef}
      layout
      className="w-full border-3 border-black rounded-3xl pt-2 pb-3 px-4 shadow-2xl mt-8" 
      initial={{
        opacity: 0
      }}
      animate={postAnimation}
      exit={{
        opacity: 0,
        transition: { ease: "easeInOut", duration: 0.75 }
      }}
      whileHover={{
        scale: 1.025,
        transition: {
          type: "easeInOut",
          duration: 0.5
        }
      }}
      transition={{
        ease: "easeInOut",
        duration: 0.6
      }}
    >
      <div className="flex justify-between md:justify-start items-center">
        <span className="text-sm text-nowrap md:text-lg mr-0.4">posted in</span>
        <div className="w-[50px] h-[50px] absolute opacity-0 md:static md:opacity-100 flex justify-center items-center">
          <div className="w-[40px] h-[40px] rounded-full border-[3px] border-black overflow-hidden flex justify-center items-center">
            <img src={`http://localhost:8000/api/feed/images?image_name=${communityImage}`} className="object-cover w-[100%] h-[100%]"></img>
          </div>
        </div>
        <span className="text-lg md:text-2xl font-semibold">{communityName}</span>
        <span className="ml-0 md:ml-auto">{date}</span>
      </div>
      <div>
        <p className="text-3xl font-bold mb-3">
          {title}
        </p>
        {
          image && <div className="relative overflow-hidden rounded-xl">
            <img src={`http://localhost:8000/api/feed/images?image_name=${image}`} className="object-cover rounded-xl blur-3xl w-[150%] h-[150%] -z-10 absolute inset-0"></img>
            <img src={`http://localhost:8000/api/feed/images?image_name=${image}`} className="object-contain max-h-130 w-full h-full z-10 mx-auto"></img>
          </div>
        }
        <p className={cn("text-lg text-stone-400", image ? "mt-3" : "")}>
          {text}
        </p>
      </div>
      <div className="flex justify-start items-center gap-3 mt-2.5">
        <Heart fill={likeClicked ? "#ff2b2bff" : "#ffffff"} size={40} onClick={() => setLikeClicked(prev => (!prev)) }className="cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out active:scale-95"/>
        <MessageCircle fill="#fff"  size={36} className="cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out active:scale-95"/>
      </div>
      <div className="ml-1 mt-1">
        {likeClicked ?  likes + 1 : likes} likes.
      </div>
    </motion.div>
  )
}

const Community = ({item, setCommunities, setPosts}) => {

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
      setTimeout(() => {
        setCommunities(prev => prev.filter(i => i != item));
        setPosts(prev => prev.filter(i => i.communityName.toLowerCase() != item));
      }, 250)
    })
    
    // Remove cookie from list
    const cookies = getCookie(document, "communities"); 
    if (cookies) {
      const list = cookies.split(",");
      if (list[list.length - 1].length === 0) {
        list.pop()
      }
      const newCookies = list.filter(i => i != item);
      document.cookie = `communities=${newCookies.join()}; max-age=2592000`
    }


  }

  return <motion.div
    layout  
    className='shadow-lg relative h-fit overflow-hidden rounded-full grid place-items-center bg-white border-3 border-black py-2 px-3 text-lg cursor-pointer'
    initial={{
      scale: 1,
      opacity: 0
    }}
    animate={{
      opacity: 1,
      transition: {
        opacity: {
          duration: 1,
        }
      }
    }}
    whileHover={{
      scale: 1.05
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
    <motion.span layout className='text-black'>{item.toUpperCase()}</motion.span> {/* Adding layout to prevent graphical glitches. */}
    <motion.span layout initial={{ height: "0%" }} animate={bgAnimationControls} className='absolute left-0 bottom-0 right-0 bg-black'></motion.span>
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x absolute" aria-hidden="true">
      <motion.path animate={checkAnimationControls} d="M18 6 6 18" initial={{ pathLength: 0, opacity: 0}}/>
      <motion.path animate={checkAnimationControls} d="m6 6 12 12" initial={{ pathLength: 0, opacity: 0}}/> 
    </motion.svg> {/* Svg copied from Lucide-React */}
  </motion.div> 
}

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>

const Page = ({communities, setCommunities, posts, setPosts}) => {

  if (communities.length >= 0) {

    return <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }} className='flex-none mx-auto mt-4.25 flex flex-wrap gap-2 justify-center items-start'>
      <AnimatePresence>
        {
          communities.map((item, index) => {
            return <Community key={item} item={item} setCommunities={setCommunities} setPosts={setPosts}/>
          })
        }
        <motion.div layout className="w-full flex justify-center" key="msg">
          <motion.p
            key={communities.length === 0 ? "empty-msg" : "leave-msg"}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            animate={{ opacity: 1, transition: { opacity: { duration: 1, ease: "easeInOut" } } }}
            className='text-lg text-center mt-[3px]'
          >
            {communities.length === 0
              ? "you are not part of any communities! join one in the explore page"
              : "click any community to leave it"}
          </motion.p>
        </motion.div>
        <div key="posts" className="w-full mx-auto">
            <AnimatePresence>
              {
                posts.map((item, index) => {
                  return <Post key={`${item.id}`} communityName={item.communityName} communityImage={item.communityImage} date={item.date} title={item.title} image={item.image} text={item.text} likes={item.likes}/>
                })
              }
              {
                (communities.length !== 0 && posts.length === 0) && 
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ease: "easeInOut", duration: 1 }} className="text-3xl font-bold text-center">no posts yet! create one in the create page.</motion.p>
              }
            </AnimatePresence>
          <div className="h-12" key="padding"/>
        </div>
      </AnimatePresence>
    </motion.div>

  }

}

function Feed() {

  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [render, setRender] = useState(false); // Have to have this or else get some weird layout animations.
  const [excludeList, setExcludeList] = useState([]);

  const { makeRequest } = useApi();

  useEffect(() => {

    //Get communities and request posts.
    const cookies = getCookie(document, "communities")
    let list = [];
    if (cookies) {
      list = cookies.split(",");
      if (list[list.length - 1].length === 0)
        list.pop()
      setCommunities(list);
    }
    makeRequest(`feed/get-posts?communities=${list.join()}&exclude=${excludeList.join()}`, {
      method: "GET"
    }).then((result) => {
      setPosts(result);
      setRender(true);
    })

  }, [])

  if (render) {
    return ( 
      <div className="w-100 md:w-170 mx-auto">
        <motion.p animate={{ opacity: 1, transition: { opacity: { duration: 1, ease: "easeInOut" } } }} initial={{ opacity: 0 }} className="text-4xl text-center mt-7">your communities</motion.p> {/* Adding layout prop to prevent scaling issues. */}
        <Page communities={communities} setCommunities={setCommunities} posts={posts} setPosts={setPosts}/>
      </div>
    )
  }
}

export default Feed;
