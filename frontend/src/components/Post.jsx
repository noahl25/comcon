
import { useRef, useState, useEffect } from 'react'
import { useApi } from '../lib/api'
import { motion, useInView, useAnimationControls } from 'framer-motion'
import { cn } from '../lib/utils'
import { Heart, MessageCircle } from 'lucide-react'

//Post component.
export const Post = ({ communityName, communityImage, date, title, image, text, likes, postId, userLiked }) => {

	const [likeClicked, setLikeClicked] = useState(false);

	const postRef = useRef(null);
	const inView = useInView(postRef, { once: false, amount: 0.1 });
	const postAnimation = useAnimationControls();

	const { makeRequest } = useApi();

	useEffect(() => {

		if (inView) {
			postAnimation.start({
				opacity: 1,
				transition: {
					ease: "easeInOut",
					duration: 0.8
				}
			});
		}
		else {
			postAnimation.start({
				opacity: 0,
				transition: {
					ease: "easeInOut",
					duration: 0.8
				}
			});
		}


	}, [inView]);

	useEffect(() => {

		if (userLiked) {
			setLikeClicked(true);
		}

	}, [])

	const onLikeClicked = () => {

		makeRequest(`feed/update-likes?liked=${!likeClicked}&post_id=${postId}`, {
			method: "PATCH",
			credentials: "include"
		});

		setLikeClicked(prev => (!prev)); //Immediately update on frontend.

	}

	return (
		<motion.div
			ref={postRef}
			layout
			className="w-full border-3 border-black rounded-3xl pt-2 pb-3 px-4 shadow-2xl mt-8"
			initial={{
				opacity: 0
			}}
			animate={postAnimation}
			exit={{
				opacity: 0,
				transition: { ease: "easeInOut", duration: 0.75 }
			}}
			whileHover={{
				scale: 1.02,
			}}
			transition={{
				ease: "easeInOut",
				duration: 0.6
			}}
		>
			<div className="flex justify-between md:justify-start items-center">
				<span className="text-sm text-nowrap md:text-lg mr-0.4">posted in</span>
				{
					communityImage && <div className="w-[50px] h-[50px] absolute opacity-0 md:static md:opacity-100 flex justify-center items-center">
						<div className="w-[40px] h-[40px] rounded-full border-[3px] border-black overflow-hidden flex justify-center items-center">
							<img src={`http://localhost:8000/api/feed/images?image_name=${communityImage}`} className="object-cover w-[100%] h-[100%]"></img>
						</div>
					</div>
				}
				<span className={cn("text-lg md:text-2xl font-semibold relative -translate-y-[1.2px]", communityImage ? "" : "ml-1")}>{communityName}</span>
				<span className="ml-0 md:ml-auto">{date}</span>
			</div>
			<div>
				<p className={cn("text-3xl font-bold mb-3", communityImage ? "" : "mt-2")}>
					{title}
				</p>
				{
					image && <div className="relative overflow-hidden rounded-xl">
						<img src={`http://localhost:8000/api/feed/images?image_name=${image}`} className="object-cover rounded-xl blur-3xl w-[150%] h-[150%] -z-10 absolute inset-0"></img>
						<img src={`http://localhost:8000/api/feed/images?image_name=${image}`} className="object-contain max-h-130 w-full h-full z-10 mx-auto"></img>
					</div>
				}
				<p className={cn("text-lg text-stone-400", image ? "mt-3" : "")}>
					{text}
				</p>
			</div>
			<div className="flex justify-start items-center gap-3 mt-3">
				<Heart fill={likeClicked ? "#ff2b2bff" : "#ffffff"} size={40} onClick={onLikeClicked} className="cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out active:scale-95" />
				<MessageCircle fill="#fff" size={36} className="cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out active:scale-95" />
			</div>
			<div className="ml-1 mt-1">
				{likeClicked ? likes + 1 : likes} likes.
			</div>
		</motion.div>
	)
}