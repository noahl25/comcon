import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const Post = ({communityName, communityImage, date, title, image, text, likes}) => {
  return (
    <motion.div 
      className="w-full border-3 border-black rounded-3xl pt-2 pb-3 px-4 shadow-2xl mt-10" 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeInOut", duration: 1 }}
      viewport={{ once: false, amount: 0.1 }}
    >
      <div className="flex justify-start items-center">
        <span className="text-md mr-0.4">posted in</span>
        <div className="w-[50px] h-[50px] flex justify-center items-center">
          <div className="w-[40px] h-[40px] rounded-full border-3 border-black overflow-hidden flex justify-center items-center">
            <img src={communityImage} className="object-cover w-[150%] h-[150%]"></img>
          </div>
        </div>
        <span className="text-2xl font-semibold">{communityName}</span>
        <span className="ml-auto">{date}</span>
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
        <Heart size={40} className="cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out"/>
        <MessageCircle size={36} className="cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out"/>
      </div>
      <div className="ml-1 mt-1">
        {likes} likes.
      </div>
    </motion.div>
  )
}

function Feed() {

  return (
    <div className="w-100 md:w-170 mx-auto">
      <Post communityName="Dogs" communityImage="src/assets/test.png" date="2/15/2025" title="Lorem impsum" image="src/assets/test.png" text="Lorem impsum" likes="2"/>
      <Post communityName="Dogs" communityImage="src/assets/test.png" date="2/15/2025" title="Lorem impsum" image="src/assets/test.png" text="Lorem impsum" likes="2"/>
      <Post communityName="Dogs" communityImage="src/assets/test.png" date="2/15/2025" title="Lorem impsum" image="src/assets/test.png" text="Lorem impsum" likes="2"/>
      <div className="h-12"/>
    </div>
  )
}

export default Feed;
