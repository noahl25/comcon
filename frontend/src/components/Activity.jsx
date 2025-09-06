import { motion, AnimatePresence, easeIn } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Post } from "./Post";
import { useApi } from "../lib/api";
import { ContextMenu } from "./ContextMenu";
import { Trash } from "lucide-react";
import { Comments } from "./Comments";

//Underline component to make filter options more clear.
const DynamicUnderline = ({ state }) => {

	return <motion.div 
		initial={{ width: "182.9629669189453px", left: "-16px", opacity: 0 }} 
		animate={{ 
			...state, 
			opacity: 1,
			transition: {
				opacity: {
					opacity: { duration: 1, ease: "easeInOut" }
				},
				width: {
					ease: "easeInOut", duration: 1, type: "spring"
				},
				left: {
					ease: "easeInOut", duration: 1, type: "spring"
				}
			}
		}} 
		className="absolute h-[5px] bg-black -bottom-3 rounded-full z-20"
	/>

}

function Activity() {

	const [posts, setPosts] = useState([]);
	const [render, setRender] = useState(false);

	const [showContextMenu, setShowContextMenu] = useState(false);
	const [contextMenuOptions, setContextMenuOptions] = useState([]);
	const [contextMenuPosition, setContextMenuPosition] = useState({
		x: 0,
		y: 0
	});

	//Underline state.
	const [underlineState, setUnderlineState] = useState({
		width: 0,
		left: 0
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

		//Set initial underline.
		const item = filterParent.current.querySelector(`.msg:nth-child(1)`);
		const width = item.getBoundingClientRect().width;
		const left = item.offsetLeft;
		setUnderlineState({
			width,
			left
		});


		return () => {
			window.removeEventListener("click", onClick);
		}


	}, []);

	useEffect(() => {

		setRender(false);


		//Update posts when filter changes.
		makeRequest(`activity/${filter === 0 ? "get-user-posts" : "get-user-likes-comments"}`, {
			method: "GET",
			credentials: "include"
		}).then((response) => {
			setPosts(response);
			setRender(true);
		});

	}, [filter]);

	const onContextMenu = (e, item) => {

		//So users don't open context menu when filtering for their likes/comments (and there could be posts from other users).
		if (filter !== 0) return;

		e.preventDefault();

		//Setup context menu.
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
				icon: <Trash size={25}/>,
              	hover: "#f87171"
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

	const filterParent = useRef(null);

	const onClickFilter = (itemIndex) => {
		onChangeFilter(itemIndex == 0 ? 0 : 1);
		const item = filterParent.current.querySelector(`.msg:nth-child(${itemIndex + 1})`);
		const width = item.getBoundingClientRect().width;
		const left = item.offsetLeft;
		setUnderlineState({
			width,
			left
		});

	}



	return (
		<>
			<AnimatePresence>
				{ showComments !== -1 && <Comments postId={showComments} sorted={true} setShowComments={setShowComments}/> }
			</AnimatePresence>
			<div className="w-100 md:w-170 mx-auto">
				<div className="flex mx-auto justify-center items-center w-2/3 text-nowrap gap-2 relative" ref={filterParent}>
					<motion.p 
						animate={{ opacity: 1, 
							transition: { opacity: { duration: 1, ease: "easeInOut" } } 
						}} 
						initial={{ opacity: 0 }}
						style={{
							color: filter == 0 ? "#000000" : "#d6d3d1"
						}} 
						className="text-4xl text-center mt-7 cursor-pointer transition-all duration-500 ease-in-out msg"
						onClick={() => onClickFilter(0)}
					>
						your posts
					</motion.p>
					<motion.p 
						animate={{ 
							opacity: 1, 
							transition: { opacity: { duration: 1, ease: "easeInOut" } } 
						}} 
						initial={{ opacity: 0 }}
						className="text-4xl text-center mt-7"
					>
						|
					</motion.p>
					<motion.p 
						animate={{ opacity: 1, 
							transition: { opacity: { duration: 1, ease: "easeInOut" } } 
						}} 
						initial={{ opacity: 0 }} 
						className="text-4xl text-center mt-7 cursor-pointer transition-all duration-500 ease-in-out msg"
						style={{
							color: filter == 1 ? "#000000" : "#d6d3d1"
						}}
						onClick={() => onClickFilter(2)}
					>
						likes/comments
					</motion.p>
					<DynamicUnderline state={underlineState}/>
				</div>
				<motion.p animate={{ opacity: 1, transition: { opacity: { duration: 1, ease: "easeInOut" } } }} initial={{ opacity: 0 }} className="text-xl text-center mt-4">right click a post or one of your comments for options.</motion.p> {/* Adding layout prop to prevent scaling issues. */}
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