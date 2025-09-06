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
	const [contextMenuOptions, setContextMenuOptions] = useState([]);
	const [contextMenuPosition, setContextMenuPosition] = useState({
		x: 0,
		y: 0
	});

	const { makeRequest } = useApi();

	//0 = user posts, 1 = user likes/comments.
	const [filter, setFilter] = useState(0);

	const onChangeFilter = (val) => {
		setFilter(val);
	}

	useEffect(() => {

		const onClick = (e) => {
			setShowContextMenu(false);
		}

		window.addEventListener("click", onClick);

		return () => {
			window.removeEventListener("click", onClick);
		}


	}, []);

	useEffect(() => {

		setRender(false);

		makeRequest(`activity/${filter === 0 ? "get-user-posts" : "get-user-likes-comments"}`, {
			method: "GET",
			credentials: "include"
		}).then((response) => {
			setPosts(response);
			setRender(true);
		});

	}, [filter]);

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
		setContextMenuOptions(options);

	}

	//-1 to not show comments or positive post id to show comments.
	const [showComments, setShowComments] = useState(-1);

	return (
		<>
			<AnimatePresence>
				{ showComments !== -1 && <Comments postId={showComments} sorted={true} setShowComments={setShowComments}/> }
			</AnimatePresence>
			<div className="w-100 md:w-170 mx-auto">
				<div className="flex justify-center items-center w-full text-nowrap gap-2">
					<motion.p 
						animate={{ opacity: 1, 
							transition: { opacity: { duration: 1, ease: "easeInOut" } } 
						}} 
						initial={{ opacity: 0 }}
						style={{
							color: filter == 0 ? "#000000" : "#d6d3d1"
						}} 
						className="text-4xl text-center mt-7 cursor-pointer transition-all duration-500 ease-in-out"
						onClick={() => onChangeFilter(0)}
					>
						your posts
					</motion.p>
					<motion.p 
						animate={{ opacity: 1, 
							transition: { opacity: { duration: 1, ease: "easeInOut" } } 
						}} 
						initial={{ opacity: 0 }} 
						className="text-4xl text-center mt-7 cursor-pointer transition-all duration-500 ease-in-out"
						style={{
							color: filter == 1 ? "#000000" : "#d6d3d1"
						}}
						onClick={() => onChangeFilter(1)}
					>
						likes/comments
					</motion.p>
				</div>
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
							<motion.p 
								initial={{ opacity: 0 }} 
								layout 
								animate={{ 
									opacity: 1,
									transition: {
										ease: "easeInOut",
										duration: 1,
										delay: 0.25
									}
								}}
								exit={{
									opacity: 0
								}}
								transition={{ ease: "easeInOut", duration: 0.65 }} 
								className="text-3xl font-bold text-center mt-4"
							>
								{
									filter === 0 ?
									"no posts yet! create one in the create page."
									:
									"no likes/comments yet!"
								}
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