import { X, Plus, MessageCircle, CornerDownRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { animate, motion } from "framer-motion"
import { useApi } from "../lib/api"

const Comment = ({ text, isUsers }) => {

    return (
        <div className="w-full z-300 border-b-stone-200 border-b-2 pb-2 mb-2 last:mb-0">
            <p className={cn("ml-[2px] text-[23px]", isUsers ? "font-extrabold" : "")}>{isUsers ? "you said" : "someone said"}</p>
            <div className="flex justify-start items-start relative -translate-y-[4px]">
                <CornerDownRight className="" size={45}/>
                <p className="text-[23px] mt-[10px] ml-1.5 w-full">{text}</p>
            </div>
        </div>
    )
}

export const Comments = ({ postId, setShowComments, sorted }) => {

    const [comments, setComments] = useState([]);

    const commentsDiv = useRef(null);

    const { makeRequest } = useApi();

    useEffect(() => {

        //Allow user to scroll inside comments if overflow.
        const onMouseWheel = (e) => {
            commentsDiv.current.scrollBy({
                top: e.deltaY,
                behavior: "smooth"
            });
        }

        window.addEventListener("wheel", onMouseWheel);

        //Get comments from post.
        makeRequest(`feed/get-comments?post_id=${postId}&sorted=${sorted}`, {
            method: "GET",
            credentials: "include"
        }).then((comments) => {
            setComments(comments);
        })


8
        return () => window.removeEventListener("wheel", onMouseWheel);

    }, [])

    return (
        <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <motion.div 
                className="relative max-w-[700px] w-[700px] h-2/3 bg-white rounded-3xl border-3 border-black shadow-2xl z-50 p-4 translate-y-8"
                initial={{
                    scale: 0
                }}
                animate={{
                    scale: 1
                }}
                exit={{
                    scale: 0
                }}
                transition={{
                    duration: 0.75,
                    ease: "easeInOut"
                }}
            >
                <div className="w-full h-full pb-2">
                    <div className="absolute right-0 -top-10 cursor-pointer hover:scale-115 transition-all duration-500 ease-in-out" onClick={() => setShowComments(-1)}>
                        <X size={30} color="#000000"/>
                    </div>
                    <div className="flex justify-start items-center gap-2 transition-all duration-500 ease-in-out w-full mb-3">
                        <MessageCircle size={50} color="#000000" className="relative -translate-y-[0.2px]"/>
                        <form className="relative grow">
                            <input placeholder="Add a comment..." type="text" id="title" name="title" maxLength="75" autoCorrect="off" autoComplete="off" className='focus:outline-none border-3 bg-white rounded-2xl text-left text-nowrap w-full py-2 px-4 text-md'/>
                        <Plus className="absolute top-2.5 right-2 cursor-pointer"/>
                        </form>
                    </div>
                    {   comments.length !== 0 &&
                        <motion.div 
                            className="bg-white w-full h-[93%] overflow-hidden overflow-y-auto scroll-div pr-5" 
                            ref={commentsDiv}
                            initial={{
                                opacity: 0
                            }}
                            animate={{
                                opacity: 1
                            }}
                            transition={{ 
                                ease: "easeInOut", 
                                duration: 0.75
                            }} 
                        >
                            {
                                comments.map((item, index) => {
                                    return <Comment key={index} text={item.text} isUsers={item.isUsers}/>
                                })
                            }
                        </motion.div>
                    }
                </div>
            </motion.div>
        </div>
    )

}