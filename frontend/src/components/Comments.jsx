import { X, Plus, MessageCircle, CornerDownRight, Pencil, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useApi } from "../lib/api"
import { ContextMenu } from "./ContextMenu"
import { Trash } from "lucide-react"

//Modal for editing comment.
const EditComment = ({ commentId, text, setEditComment, commentElement }) => {

    const { makeRequest } = useApi();

    const formRef = useRef(null);

    const onSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(formRef.current);

        makeRequest("activity/edit-comment", {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({
                "comment_id": commentId,
                "text": formData.get("text")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            
            if (!response["status"].includes("Error")) {
                commentElement.textContent = formData.get("text");
            }

        });

        setEditComment(false);

    }

    return <motion.div

        className="fixed inset-0 flex flex-col justify-center items-center z-10000000" 
        initial={{
            scale: 0
        }}
        animate={{
            scale: 1
        }}
        exit={{
            scale: 0,
            transition: {
                ease: "easeInOut",
                duration: 0.75
            }
        }}
        transition={{
            type: "spring",
            stiffness: 80,
            bounce: 1
        }}
    >
        <p className="text-xl">Edit Comment</p>
        <div className="w-1/3 rounded-full h-[75px] flex justify-center items-center">
            <form ref={formRef} className="relative grow flex border-3 bg-white rounded-2xl" onSubmit={onSubmit}>
                <input defaultValue={text} type="text" required id="text" name="text" maxLength="200" autoCorrect="off" autoComplete="off" className='focus:outline-none rounded-2xl text-left text-nowrap w-full py-2 pl-3 pr-1 text-md'/>
                <button type="submit">
                    <ArrowRight className="top-2.5 right-2 cursor-pointer mr-1 hover:scale-115 transition-all duration-500 ease-in-out" size={30}/>
                </button>
            </form>
        </div>
    </motion.div>

}

const Comment = ({ text, isUsers, id }) => {

    return (
        <motion.div 
            layout 
            className={cn("comment w-full z-300 border-b-stone-200 border-b-2 pb-2 mb-2 last:mb-0", `comment-id-${id}`, `is-users-${isUsers ? 1 : 0}`)}
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
                duration: 0.75,
                ease: "easeInOut"
            }} 
        >
            <p className={cn("ml-[2px] text-[23px] pointer-events-none", isUsers ? "font-extrabold" : "")}>{isUsers ? "you said" : "someone said"}</p>
            <div className="flex justify-start items-start">
                <CornerDownRight className="flex-none" size={45}/>
                <p className="flex-none text-[23px] mt-[10px] ml-1.5 w-[92.5%] text-pretty break-words pointer-events-none comment-text">{text}</p>
            </div>
        </motion.div>
    )
}

export const Comments = ({ postId, setShowComments, sorted }) => {

    const [comments, setComments] = useState([]);

    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuOptions, setContextMenuOptions] = useState([]);
	const [contextMenuPosition, setContextMenuPosition] = useState({
		x: 0,
		y: 0
	});

    const [editComment, setEditComment] = useState(false);
    const [editCommentOptions, setEditCommentOptions] = useState({
        commentId: 0,
        text: "",
        commentElement: null
    })


    const commentsDiv = useRef(null);
    const commentsPopup = useRef(null);

    const { makeRequest } = useApi();
    
    const onOverlayClick = (e) => {
        // Only close if click was outside comments
        if (commentsPopup.current && !commentsPopup.current.contains(e.target)) {
            setShowComments(-1);
        }
    }

    useEffect(() => {

        //Get comments from post.
        makeRequest(`feed/get-comments?post_id=${postId}&sorted=${sorted}`, {
            method: "GET",
            credentials: "include"
        }).then((comments) => {
            setComments(comments);
        });

        const onContextMenu = (e) => {

            e.preventDefault();

            if (!e.target.closest(".comment")) return;

            const commentElement = e.target.closest(".comment");
            if (!commentElement) return;

            //If user doesnt own the comment don't show context menu.
            const divClasses =  commentElement.classList;
            const classArray = [...divClasses];

            const userOwns = classArray[classArray.length - 1];
            if (userOwns[userOwns.length - 1] !== "1") return;

            const deleteComment = () => {

                //Get comment id from class list. Backend checks if the user owns the comment (if they edit html to say they do).
                const idClass = classArray[classArray.length - 2];
                const id = parseInt(idClass.substr(11))

                makeRequest("activity/delete-comment", {
                    method: "DELETE",
                    credentials: "include",
                    body: JSON.stringify({
                        "comment_id": id
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    setComments(prev => ( prev.filter((item) => item.id != id) ) );
                })
                
            }

            //Edit comment context menu function
            const editComment = () => {

                const idClass = classArray[classArray.length - 2];
                const id = parseInt(idClass.substr(11));
                const commentElement = e.target.querySelector(".comment-text");
                

                setEditComment(true);
                setEditCommentOptions({
                    commentId: id,
                    text: commentElement.textContent,
                    commentElement: commentElement,
                });

            }

            const options = [
                {
                    name: "Delete",
                    action: deleteComment,
                    icon: <Trash size={25}/>,
                    hover: "#f87171"
                },
                {
                    name: "Edit",
                    action: editComment,
                    icon: <Pencil size={25}/>,
                    hover: "#1ea8bdff"
                }
            ]

            setShowContextMenu(true);
            setContextMenuPosition({
                x: e.clientX, 
                y: e.clientY
            });
            setContextMenuOptions(options);

        }

        const onClick = (e) => {
			setShowContextMenu(false);
		}

        window.addEventListener("contextmenu", onContextMenu);
        window.addEventListener("click", onClick);

        return () =>  {
            window.removeEventListener("contextmenu", onContextMenu);
            window.removeEventListener("click", onClick);
        }

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
        <>
            <AnimatePresence>
                { showContextMenu && <ContextMenu x={contextMenuPosition.x} y={contextMenuPosition.y} options={contextMenuOptions}/> }
            </AnimatePresence>
            <AnimatePresence>
                { editComment && <EditComment commentId={editCommentOptions.commentId} text={editCommentOptions.text} setEditComment={setEditComment} commentElement={editCommentOptions.commentElement}/> }
            </AnimatePresence>
            <div className="fixed inset-0 flex justify-center items-center overflow-hidden z-1000" onClick={onOverlayClick}>
                <motion.div 
                    ref={commentsPopup}
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
                            <X size={30} strokeWidth={2} color="#000000"/>
                        </div>
                        <div className="flex justify-start items-center gap-2 transition-all duration-500 ease-in-out w-full mb-3">
                            <MessageCircle size={50} color="#000000" className="relative -translate-y-[0.2px]"/>
                            <form className="relative grow flex border-3 bg-white rounded-2xl " onSubmit={onSubmit}>
                                <input placeholder="Add a comment..." type="text" required id="text" name="text" maxLength="200" autoCorrect="off" autoComplete="off" className='focus:outline-none rounded-2xl text-left text-nowrap w-full py-2 pl-3 pr-1 text-md'/>
                                <button type="submit">
                                    <Plus className="top-2.5 right-2 cursor-pointer mr-1" size={30}/>
                                </button>
                            </form>
                        </div>
                        <AnimatePresence>
                            {   comments.length !== 0 &&
                                <motion.div 
                                    className="bg-white w-full h-[93%] overflow-hidden overflow-y-auto scroll-div pr-5" 
                                    ref={commentsDiv}
                                    key="comments"
                                    initial={{
                                        opacity: 1
                                    }}
                                    exit={{
                                        opacity: 0
                                    }}
                                >
                                    <AnimatePresence>
                                        {
                                            comments.map((item) => {
                                                return <Comment key={item.id} text={item.text} isUsers={item.isUsers} id={item.id}/>
                                            })
                                        }
                                    </AnimatePresence>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </>
    )

}