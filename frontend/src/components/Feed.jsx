import { Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls, useInView } from "framer-motion";
import { cn, getCookie } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../lib/api";
import { Post } from "./Post";
import { Comments } from "./Comments";

//Induvidual community button.
const Community = ({ item, setCommunities, setPosts }) => {

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
				//If community is removed, remove it from list and remove posts under that community.
				setCommunities(prev => prev.filter(i => i != item));
				setPosts(prev => prev.filter(i => {
					return i.communityName.toLowerCase() != item.toLowerCase()
				}));
				
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
			<motion.path animate={checkAnimationControls} d="M18 6 6 18" initial={{ pathLength: 0, opacity: 0 }} />
			<motion.path animate={checkAnimationControls} d="m6 6 12 12" initial={{ pathLength: 0, opacity: 0 }} />
		</motion.svg> {/* Svg copied from Lucide-React */}
	</motion.div>
}

const Page = ({ communities, setCommunities, posts, setPosts, loadMorePosts, loadMoreMsg }) => {

	//-1 to not show comments or positive post id to show comments.
	const [showComments, setShowComments] = useState(-1);

	if (communities.length >= 0) {

		return ( 
			<>
				<AnimatePresence>
					{ showComments !== -1 && <Comments postId={showComments} sorted={false} setShowComments={setShowComments}/> }
				</AnimatePresence>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }} className='flex-none mx-auto mt-4.25 flex flex-wrap gap-2 justify-center items-start'>
					<AnimatePresence>
							{
								communities.map((item, index) => {
									return <Community key={item} item={item} setCommunities={setCommunities} setPosts={setPosts} />
								})
							}
							<AnimatePresence mode="wait">
								{
									communities.length !== 0
									?
										<motion.div
										key="has-communities"
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ ease: "easeInOut", duration: 0.75 }}
										className="w-full flex justify-center"
									>
										<motion.p layout className="text-xl text-center">click any community to leave it.</motion.p>
									</motion.div>
									: 
									<motion.div
										key="no-communities"
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ ease: "easeInOut", duration: 0.75 }}
										className="w-full flex justify-center"
									>
										<motion.p layout className="text-xl text-center">join a community in the explore page to see posts!</motion.p>
									</motion.div>
								}
							</AnimatePresence>
						<motion.div key="posts" className="w-full mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1, duration: 1, ease: "easeInOut" }}}>
							<AnimatePresence initial={false}>
								{
									posts.map((item) => {
										return <Post setShowComments={setShowComments} key={item.id} postId={item.id} userLiked={item.userLiked} communityName={item.communityName} communityImage={item.communityImage} date={item.date} title={item.title} image={item.image} text={item.text} likes={item.likes} />
									})
								}
							</AnimatePresence>
							<div className="h-12" key="padding" />
							<AnimatePresence>
								{ (communities.length !== 0 && posts.length !== 0) && 
									<motion.div 
										className="text-center pb-13 cursor-pointer text-stone-400" 
										layout
										onClick={loadMorePosts}
										initial={{
											opacity: 0
										}}
										animate={{
											opacity: 1
										}}
										exit={{
											opacity: 0,
											transition: { ease: "easeInOut", duration: 0.75 }
										}}
										whileHover={{
											scale: 1.02,
											transition: {
												duration: 0.6
											}
										}}
										transition={{
											ease: "easeInOut",
											duration: 0.6
										}}
									>
										{loadMoreMsg}
									</motion.div> 
								}
								{
									posts.length === 0 && communities.length !== 0 &&
									<motion.p key="msg" 
										initial={{ opacity: 0 }} 
										layout 
										animate={{ 
											opacity: 1,
											transition: {
												ease: "easeInOut",
												delay: 1,
												duration: 0.75
											}
										}}
										exit={{
											opacity: 0,
											transition: {
												ease: "easeInOut",
												duration: 0.75
											}
										}}
										transition={{ ease: "easeInOut", duration: 0.75 }} 
										className="text-3xl font-bold text-center relative -translate-y-[40px]"
									>
										no posts yet! create one in the create page.
									</motion.p>
								}
							</AnimatePresence>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</>
		)

	}

}

function Feed() {

	const [communities, setCommunities] = useState([]);
	const [posts, setPosts] = useState([]);
	const [render, setRender] = useState(false); // Have to have this or else get some weird layout animations.

	const { makeRequest } = useApi();

	const getCommunities = () => {
		const cookies = getCookie(document, "communities")
		let list = [];
		if (cookies) {
			list = cookies.split(",");
			if (list[list.length - 1].length === 0)
				list.pop()
		}
		return list

	}

	useEffect(() => {

		//Get communities and request posts.
		const list = getCommunities();
		setCommunities(list);

		makeRequest(`feed/get-posts?communities=${list.join()}&exclude=`, {
			method: "GET",
			credentials: "include",
		}).then((result) => {
			setPosts(result);
			setRender(true);
		})

	}, [])
	
	useEffect(() => {

		const list = getCommunities();

		if (list.length !== 0 && posts.length === 0 && render) {

			const exclude = posts.map(post => post.id);

			makeRequest(`feed/get-posts?communities=${list.join()}&exclude=${exclude.join()}`, {
				method: "GET",
				credentials: "include",
			}).then((result) => {
				console.log("here");
				setPosts(result);
			})
		}

	}, [communities])

	const [loadMoreMsg, setLoadMoreMsg] = useState("load more");

	const loadMorePosts = () => {
		
		if (posts.length === 0) return;

		const list = getCommunities();
		const exclude = posts.map(post => post.id);
			

		makeRequest(`feed/get-posts?communities=${list.join()}&exclude=${exclude.join()}`, {
			method: "GET",
			credentials: "include",
		}).then((result) => {

			if (result.length === 0) {
				setLoadMoreMsg("no more posts found!")
			}
			setPosts(prev => {
				return [...prev, ...result]
			});
		});

	}

	if (render) {
		return ( 
			<div className="w-100 md:w-170 mx-auto">
				<motion.p animate={{ opacity: 1, transition: { opacity: { duration: 0.75, ease: "easeInOut" } } }} initial={{ opacity: 0 }} className="text-4xl text-center mt-7">your communities</motion.p> {/* Adding layout prop to prevent scaling issues. */}
				<Page communities={communities} setCommunities={setCommunities} posts={posts} setPosts={setPosts} loadMorePosts={loadMorePosts} loadMoreMsg={loadMoreMsg}/>
			</div>
		)
	}
}

export default Feed;
