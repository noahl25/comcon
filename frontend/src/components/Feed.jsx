import { Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { cn, getCookie } from "../lib/utils";
import { useState, useEffect } from "react";

const Post = ({communityName, communityImage, date, title, image, text, likes}) => {

  const [likeClicked, setLikeClicked] = useState(false);

  return (
    <motion.div
      layout 
      className="w-full border-3 border-black rounded-3xl pt-2 pb-3 px-4 shadow-2xl mt-8" 
      initial={{ 
        opacity: 0 
      }} 
      whileInView={{ 
        opacity: 1, 
        transition: { ease: "easeInOut", duration: 1 }
      }}
      exit={{
        opacity: 0,
        transition: { ease: "easeInOut", duration: 1 }
      }}
      viewport={{ once: false, amount: 0.1 }}
      whileHover={{
        scale: 1.025,
        transition: {
          type: "easeInOut",
          visualDuration: 0.5
        }
      }}
    >
      <div className="flex justify-between md:justify-start items-center">
        <span className="text-sm text-nowrap md:text-md mr-0.4">posted in</span>
        <div className="w-[50px] h-[50px] absolute opacity-0 md:static md:opacity-100 flex justify-center items-center">
          <div className="w-[40px] h-[40px] rounded-full border-3 border-black overflow-hidden flex justify-center items-center">
            <img src={communityImage} className="object-cover w-[150%] h-[150%]"></img>
          </div>
        </div>
        <span className="text-lg md:text-2xl font-semibold">{communityName}</span>
        <span className="ml-0 md:ml-auto">{date}</span>
      </div>
      <div>
        <p className="text-3xl font-bold mb-3">
          {title}
        </p>
        <div className="relative overflow-hidden rounded-xl">
          <img src={image} className="object-cover rounded-xl blur-3xl w-[150%] h-[150%] -z-10 absolute inset-0"></img>
          <img src={image} className="object-contain z-10 mx-auto"></img>
        </div>
        <p className={cn("text-lg text-stone-400", image === undefined ? "" : "mt-3")}>
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
        const cookies = getCookie(document, "communities"); 
        // Remove cookie from list
        if (cookies) {
          const list = cookies.split(",");
          if (list[list.length - 1].length === 0) {
            list.pop()
          }
          const newCookies = list.filter(i => i != item);
          document.cookie = `communities=${newCookies.join()}; max-age=2592000`
        }
        setCommunities(prev => prev.filter(i => i != item));
        setPosts(prev => prev.filter(i => i.communityName.toLowerCase() != item));
      }, 250)
    })

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
            return <Community key={`${item}-${index}`} item={item} setCommunities={setCommunities} setPosts={setPosts}/>
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
        <motion.div transition={{ ease: "easeInOut", duration: 1 }} className="w-full mx-auto" key="posts">
            {
              posts.map((item, index) => {
                return <Post key={`${index}-${item.communityName}-${item.title}`} communityName={item.communityName} communityImage={item.communityImage} date={item.date} title={item.title} image={item.image} text={item.text} likes={item.likes}/>
              })
            }
          <div className="h-12" key="padding"/>
        </motion.div>
      </AnimatePresence>
    </motion.div>

  }

}

const testPosts = [
  {
    communityName: "React Devs",
    communityImage: "src/assets/test.png",
    date: "Aug 31, 2025",
    title: "Animating with Framer Motion",
    image: "src/assets/test.png",
    text: "Just discovered how smooth layout animations can be with motion.div!",
    likes: 12,
  },
  {
    communityName: "UI Design",
    communityImage: "src/assets/test.png",
    date: "Aug 30, 2025",
    title: "Clean Design Practices",
    image: "src/assets/test.png",
    text: "Rounded corners and subtle shadows make a huge difference.",
    likes: 34,
  },
  {
    communityName: "Frontend Tips",
    communityImage: "src/assets/test.png",
    date: "Aug 29, 2025",
    title: "State Management Made Easy",
    image: "src/assets/test.png",
    text: "Sometimes useState is all you need. Don’t overcomplicate it!",
    likes: 21,
  },
];

function Feed() {

  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [render, setRender] = useState(false); // Have to have this or else get some weird layout animations.

  useEffect(() => {
    const cookies = getCookie(document, "communities")
    if (cookies) {
      const list = cookies.split(",");
      if (list[list.length - 1].length === 0)
        list.pop()
      setCommunities(list);
    }
    setPosts(testPosts);
    setRender(true);
  }, [])

  if (render) {
    return ( 
      <>
        <motion.div layout className="w-90 md:w-170 mx-auto">
          <motion.p layout className="text-4xl text-center mt-7">your communities</motion.p> {/* Adding layout prop to prevent scaling issues. */}
          <Page communities={communities} setCommunities={setCommunities} posts={posts} setPosts={setPosts}/>
        </motion.div>
      </>
    )
  }
}

export default Feed;
