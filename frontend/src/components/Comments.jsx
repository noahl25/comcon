import { X, Plus, MessageCircle, CornerDownRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { animate, AnimatePresence, motion } from "framer-motion"
import { useApi } from "../lib/api"

const Comment = ({ text, isUsers }) => {

    return (
        <motion.div 
            layout 
            className="w-full z-300 border-b-stone-200 border-b-2 pb-2 mb-2 last:mb-0"
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{
                duration: 0.75,
                ease: "easeInOut"
            }}
        >
            <p className={cn("ml-[2px] text-[23px]", isUsers ? "font-extrabold" : "")}>{isUsers ? "you said" : "someone said"}</p>
            <div className="flex justify-start items-start relative -translate-y-[4px]">
                <CornerDownRight className="" size={45}/>
                <p className="text-[23px] mt-[10px] ml-1.5 w-full">{text}</p>
            </div>
        </motion.div>
    )
}

export const Comments = ({ postId, setShowComments, sorted }) => {

    const [comments, setComments] = useState([]);

    const commentsDiv = useRef(null);

    const { makeRequest } = useApi();

    useEffect(() => {

        //Get comments from post.
        makeRequest(`feed/get-comments?post_id=${postId}&sorted=${sorted}`, {
            method: "GET",
            credentials: "include"
        }).then((comments) => {
            setComments(comments);
        });

    }, []);

    const onSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);

        makeRequest("feed/create-comment", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                "post_id": postId,
                "text": formData.get("text")
            }),
            headers: {
				"Content-Type": "application/json"
			}
        }).then((response) => {

            //Update on frontend if request goes through.
            if (!response["status"].includes("Error")) {
                setComments(prev => ([
                    {
                        text: formData.get("text"),
                        isUsers: true,
                        id: response["id"]
                    },
                    ...prev
                ]))
                e.target.reset();
            }

        });



    }

    return (
        <div className="fixed inset-0 flex justify-center items-center overflow-hidden z-10000">
            <motion.div 
                className="relative max-w-[700px] w-[700px] h-2/3 bg-white rounded-3xl border-3 border-black shadow-2xl z-50 p-4 translate-y-8"
                initial={{
                    scale: 0
                }}
                animate={{
                    scale: 1,
                    transition: {
                        type: "spring",
                        stiffness: 50
                    }
                }}
                exit={{
                    scale: 0,
                    transition: {
                        ease: "easeInOut",
                        duration: 0.75
                    }
                }}
            >
                <div className="w-full h-full pb-2">
                    <div className="absolute right-0 -top-10 cursor-pointer hover:scale-115 transition-all duration-500 ease-in-out" onClick={() => setShowComments(-1)}>
                        <X size={30} color="#000000"/>
                    </div>
                    <div className="flex justify-start items-center gap-2 transition-all duration-500 ease-in-out w-full mb-3">
                        <MessageCircle size={50} color="#000000" className="relative -translate-y-[0.2px]"/>
                        <form className="relative grow" onSubmit={onSubmit}>
                            <input placeholder="Add a comment..." type="text" required id="text" name="text" maxLength="200" autoCorrect="off" autoComplete="off" className='focus:outline-none border-3 bg-white rounded-2xl text-left text-nowrap w-full py-2 px-4 text-md'/>
                            <button type="submit">
                                <Plus className="absolute top-2.5 right-2 cursor-pointer"/>
                            </button>
                        </form>
                    </div>
                    {   comments.length !== 0 &&
                        <div 
                            className="bg-white w-full h-[93%] overflow-hidden overflow-y-auto scroll-div pr-5" 
                            ref={commentsDiv}
                        >
                            <AnimatePresence>
                                {
                                    comments.map((item, index) => {
                                        return <Comment key={item.id} text={item.text} isUsers={item.isUsers}/>
                                    })
                                }
                            </AnimatePresence>
                        </div>
                    }
                </div>
            </motion.div>
        </div>
    )

}