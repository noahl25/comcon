import { Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls, useInView } from "framer-motion";
import { cn, getCookie } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../lib/api";
import { Post } from "./Post";

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
			<motion.path animate={checkAnimationControls} d="M18 6 6 18" initial={{ pathLength: 0, opacity: 0 }} />
			<motion.path animate={checkAnimationControls} d="m6 6 12 12" initial={{ pathLength: 0, opacity: 0 }} />
		</motion.svg> {/* Svg copied from Lucide-React */}
	</motion.div>
}

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>

const Page = ({ communities, setCommunities, posts, setPosts }) => {

	if (communities.length >= 0) {

		return <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }} className='flex-none mx-auto mt-4.25 flex flex-wrap gap-2 justify-center items-start'>
			<AnimatePresence>
				{
					communities.map((item, index) => {
						return <Community key={item} item={item} setCommunities={setCommunities} setPosts={setPosts} />
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
								return <Post key={item.id} postId={item.id} userLiked={item.userLiked} communityName={item.communityName} communityImage={item.communityImage} date={item.date} title={item.title} image={item.image} text={item.text} likes={item.likes} />
							})
						}
						{
							(communities.length !== 0 && posts.length === 0) &&
							<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ease: "easeInOut", duration: 1 }} className="text-3xl font-bold text-center">no posts yet! create one in the create page.</motion.p>
						}
					</AnimatePresence>
					<div className="h-12" key="padding" />
				</div>
			</AnimatePresence>
		</motion.div>

	}

}

function Feed() {

	const [communities, setCommunities] = useState([]);
	const [posts, setPosts] = useState([]);
	const [render, setRender] = useState(false); // Have to have this or else get some weird layout animations.
	const [excludeList, setExcludeList] = useState([]); //So user doesn't see the same posts when loading more.

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
			method: "GET",
			credentials: "include"
		}).then((result) => {
			setPosts(result);
			setRender(true);
		})

	}, [])

	if (render) {
		return (
			<div className="w-100 md:w-170 mx-auto">
				<motion.p animate={{ opacity: 1, transition: { opacity: { duration: 1, ease: "easeInOut" } } }} initial={{ opacity: 0 }} className="text-4xl text-center mt-7">your communities</motion.p> {/* Adding layout prop to prevent scaling issues. */}
				<Page communities={communities} setCommunities={setCommunities} posts={posts} setPosts={setPosts} />
			</div>
		)
	}
}

export default Feed;
