import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Post } from "./Post";
import { useApi } from "../lib/api";
import { ContextMenu } from "./ContextMenu";
import { Trash } from "lucide-react";
import { Comments } from "./Comments";

function Activity() {

	const [posts, setPosts] = useState([]);
	const [render, setRender] = useState(false);

	const [showContextMenu, setShowContextMenu] = useState(false);
	const [contextMenuOptions, setShowContextMenuOptions] = useState([]);
	const [contextMenuPosition, setContextMenuPosition] = useState({
		x: 0,
		y: 0
	});

	const { makeRequest } = useApi();

	useEffect(() => {

		makeRequest("activity/get-user-posts", {
			method: "GET",
			credentials: "include"
		}).then((response) => {
			setPosts(response);
			setRender(true);
		});

		const onClick = (e) => {
			if (!e.target.closest(".context-menu")) {
				setShowContextMenu(false);
			}
		}

		window.addEventListener("click", onClick);

		return () => {
			window.removeEventListener("click", onClick);
		}


	}, []);

	const onContextMenu = (e, item) => {

		e.preventDefault();

		const deletePost = () => {
			makeRequest("activity/delete-post", {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					"post_id": item.id
				})
			});

			setPosts(prev => prev.filter(i => i.id != item.id));
			setShowContextMenu(false);
		}

		const options = [
			{
				name: "Delete",
				action: deletePost,
				icon: <Trash size={25}/>
			}
		]

		setShowContextMenu(true);
		setContextMenuPosition({
			x: e.clientX,
			y: e.clientY
		})
		setShowContextMenuOptions(options);

	}

	//-1 to not show comments or positive post id to show comments.
	const [showComments, setShowComments] = useState(-1);

	return (
		<>
			<AnimatePresence>
				{ showComments !== -1 && <Comments postId={showComments} sorted={true} setShowComments={setShowComments}/> }
			</AnimatePresence>
			<div className="w-100 md:w-170 mx-auto">
				<motion.p animate={{ opacity: 1, transition: { opacity: { duration: 1, ease: "easeInOut" } } }} initial={{ opacity: 0 }} className="text-4xl text-center mt-7">your posts</motion.p>
				<motion.p animate={{ opacity: 1, transition: { opacity: { duration: 1, ease: "easeInOut" } } }} initial={{ opacity: 0 }} className="text-xl text-center mt-2">right click a post or one of your comments for options.</motion.p> {/* Adding layout prop to prevent scaling issues. */}
				{
					render && <AnimatePresence>
						{
							posts.map((item) => {
								return <div key={item.id} onContextMenu={(e) => onContextMenu(e, item)}>
									<Post setShowComments={setShowComments} postId={item.id} userLiked={item.userLiked} communityName={item.communityName} communityImage={item.communityImage} date={item.date} title={item.title} image={item.image} text={item.text} likes={item.likes} />
								</div>
							})
						}
						{
							posts.length === 0 &&
							<motion.p key="msg" 
								initial={{ opacity: 0 }} 
								layout 
								animate={{ 
									opacity: 1,
									transition: {
										ease: "easeInOut",
										duration: 1
									}
								}}
								transition={{ ease: "easeInOut", duration: 0.65 }} 
								className="text-3xl font-bold text-center mt-4"
							>
								no posts yet! create one in the create page.
							</motion.p>
						} {/* Render user posts or error message. */}
						<div className="h-12" key="padding" />
					</AnimatePresence>
				}
				<AnimatePresence>
					{ showContextMenu && 
							<ContextMenu key="contextmenu" x={contextMenuPosition.x} y={contextMenuPosition.y} options={contextMenuOptions} /> 
					}
				</AnimatePresence>
			</div>
		</>
	)
}

export default Activity;