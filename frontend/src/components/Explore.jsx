import { CirclePlus, Search, Check, ArrowRight } from 'lucide-react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, use, useRef } from 'react'
import { getCookie, randomRange } from '../lib/utils';
import { useApi } from "../lib/api";

//
const TypewriterTextComponent = ({ examples, showExamples, exampleIndex, setExampleIndex }) => {

	const letterDelay = 0.05;
	const boxFade = 0.125;

	const fadeDelay = 4;
	const mainFade = 0.25;

	const swapDelay = 4500;

	useEffect(() => {
		const id = setInterval(() => {
			setExampleIndex(prev => (prev + 1) % examples.length); //Change example every swapDelay milliseconds.
		}, swapDelay);

		return () => clearInterval(id);
	});

	//Render each letter induvidually with component over it.
	if (showExamples) {
		return (
			<motion.div layout className='absolute top-0 left-1/2 -translate-x-1/2 h-full w-10 z-10 pointer-events-none text-stone-400 flex justify-center items-center text-lg text-center text-nowrap align-center'>
				{examples[exampleIndex].split("").map((letter, index) => {
					return <motion.span key={`${exampleIndex}-${index}`} className='relative'
						initial={{ opacity: 1 }}
						animate={{ opacity: 0 }}
						transition={{ delay: fadeDelay, duration: mainFade, ease: "easeInOut" }}
					>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: index * letterDelay, duration: 0 }}
						>
							{letter === " " ? "\u00A0" : letter}
						</motion.span>
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: [0, 1, 0] }}
							transition={{ times: [0, 0.1, 1], delay: index * letterDelay, duration: boxFade, ease: "easeInOut" }}
							className='absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-stone-600'>
						</motion.span>
					</motion.span>
				})}
			</motion.div>
		)
	}
}

const Community = ({ item, setCommunities }) => {

	const bgAnimationControls = useAnimationControls();
	const checkAnimationControls = useAnimationControls();

	const clicked = useRef(false);

	const onClick = () => { //Start animations on click and add community to cookies.

		if (clicked.current) return;

		clicked.current = true;

		const oldCookie = getCookie(document, "communities") || "";
		let newCookie = oldCookie;
		if (oldCookie) {
			newCookie = oldCookie + (oldCookie[oldCookie.length - 1] === "," ? "" : ",")
		}
		document.cookie = `communities=${newCookie + item},; max-age=2592000` //Stores saved communities in cookies for up to 30 days.

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
				//When animation is done, remove community.
				setCommunities(prev => prev.filter(i => i != item));
			}, 250)
		})

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
					delay: 1,
					ease: "easeInOut"
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
		<motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check absolute" aria-hidden="true">
			<motion.path animate={checkAnimationControls} d="M4 12 9 17 20 6" initial={{ pathLength: 0, opacity: 0 }}></motion.path>
		</motion.svg> {/* Svg copied from Lucide-React */}
	</motion.div>
}

//Render each induvidual community.
const Communities = ({ mediumDevice, currentSearch }) => {

	const { makeRequest } = useApi();

	const [communities, setCommunities] = useState([]);

	const [sendingRequest, setSendingRequest] = useState(false);

	useEffect(() => {


		//Get random communities if search is empty or look for existing communities.
		if (!sendingRequest && (communities.length === 0 || currentSearch.length !== 0)) {
			setSendingRequest(true);
			const cookie = getCookie(document, "communities");
			makeRequest(`explore/get-communities?q=${currentSearch == "" ? "random" : currentSearch}&exclude=${cookie}`, {
				method: "GET",
			}).then((data) => {
				setCommunities(data.names); 
			}).finally(() => {
				setSendingRequest(false);
			});
		}

	}, [currentSearch, sendingRequest, communities]);

	if (communities.length >= 0) {
		return <motion.div style={{ width: mediumDevice ? '50%' : '30%' }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { visualDuration: 1000 } }} className='flex-none mx-auto mt-4.25 flex flex-wrap gap-2 h-fit justify-center items-start'>
			<AnimatePresence>
				{
					communities.map((item) => {
						if (!sendingRequest)
							return <Community key={`${item}`} item={item} setCommunities={setCommunities} />
					})
				}
				<AnimatePresence mode="wait">
					{
						communities.length !== 0 ?
						<motion.p 
							layout 
							key="nocommunities" 
							initial={{ opacity: 0 }} 
							exit={{ opacity: 0, transition: { duration: 0.5 } }} 
							animate={{ opacity: 1, transition: { opacity: { duration: 1, delay: 1, ease: "easeInOut" } } }} 
							className='text-lg w-full text-center mt-[3px] h-fit'
						>
							click any community to join it or create one with the plus
						</motion.p>
							: 
						<motion.p key="communities" 
							layout 
							initial={{ opacity: 0 }} 
							exit={{ opacity: 0, transition: { duration: 0.5 } }} 
							animate={{ opacity: 1, transition: { opacity: { duration: 1, delay: 1, ease: "easeInOut" } } }} 
							className='text-lg w-full text-center mt-[3px] h-fit'
						>
							no communities found! create one by clicking the plus or find your joined communities in your feed
						</motion.p>
					} {/* display message if no communities found */}
				</AnimatePresence>
			</AnimatePresence>
		</motion.div>

	}
	else {
		return <motion.div style={{ width: mediumDevice ? '50%' : '30%' }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { visualDuration: 1000 } }} className='h-50 flex flex-wrap gap-2 justify-center items-start'>
		</motion.div>
	}

}

const CreateCommunityForm = ({ setCreateCommunity }) => {

	const bgAnimationControls = useAnimationControls();
	const checkAnimationControls = useAnimationControls();

	const [fileAdded, setFileAdded] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	const [msg, setMsg] = useState("");
	const [sentRequest, setSentRequest] = useState(false);

	const formRef = useRef(null);
	const imageRef = useRef(null);

	const onImageAdded = (e) => { //Start animations when image added.

		bgAnimationControls.start({
			height: "100%",
			transition: {
				duration: 0.75,
				ease: "easeInOut"
			}
		});
		checkAnimationControls.start({
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { delay: 0.5, type: "spring", duration: 1.5, bounce: 0 },
				opacity: { delay: 0.5, duration: 0.01 },
			},
		});

		setFileAdded(true);
		setSelectedFile(e.target.files[0]);

	}

	const { makeRequest } = useApi();
	const animationControls = useAnimationControls();

	const onSubmit = (e) => {
		e.preventDefault();

		if (!sentRequest) { //Make sure submit isn't spammed.

			const formData = new FormData(formRef.current);

			//Add image to form if uploaded.
			if (!selectedFile) {
				formData.delete("image");
			} else {
				formData.append("image", selectedFile);
			}
			makeRequest("explore/create-community", {
				method: "POST",
				body: formData
			}).then((data) => {
				if (data.status === "success") {
					setMsg("successfully created and joined community!")

					//Add user to community that was just created.
					const oldCookie = getCookie(document, "communities") || "";
					let newCookie = oldCookie;
					if (oldCookie) {
						newCookie = oldCookie + (oldCookie[oldCookie.length - 1] === "," ? "" : ",") //Make sure there is comma at end.
					}
					document.cookie = `communities=${newCookie + formData.get("name").toLowerCase()},; max-age=2592000` //Stores saved communities in cookies for up to 30 days.

					animationControls.start({
						opacity: 0,
						transition: {
							duration: 1,
							ease: "easeInOut",
							delay: 1
						}
					})
					setTimeout(() => {
						setCreateCommunity(false); //Go back.
					}, 2500);
				}
				else {
					setMsg(data.status);
					setSentRequest(false);
				}
			}).catch((error) => {
				console.log(error);
			});
		}

		setSentRequest(true);

	}

	return (
		<motion.div animate={animationControls} initial={{ opacity: 1 }} className='w-[100dvw] h-[calc(100vh-100px)]'>
			<div className='flex justify-center items-center flex-col gap-3 bg-stone-50 pt-[calc(20vh-100px)]'>
				<motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.3, ease: "easeInOut" } }}>
					<p className='text-nowrap text-5xl text-bold tracking-wide'>create your community</p>
					<form ref={formRef} onSubmit={onSubmit}>
						<p className='text-nowrap text-xl text-center mt-5 mb-1'>name (required)</p>
						<input required type="text" id="name" name="name" maxLength="20" autoCorrect="off" autoComplete="off" className='focus:outline-none border-3 bg-white shadow-xl rounded-2xl text-left w-full py-2 px-4 text-lg'></input>
						<p className='text-nowrap text-xl text-center mt-3 mb-1'>description (optional)</p>
						<div className='border-3 rounded-2xl w-full h-[300px] p-2  shadow-xl'>
							<textarea type="text" id="description" name="description" maxLength="750" autoCorrect="off" autoComplete="off" className='focus:outline-none bg-white text-wrap text-left w-full h-full resize-none px-2 py-1 text-lg'></textarea>
						</div>
						<p className='text-nowrap text-xl text-center mt-3 mb-2'>logo (optional)</p>
						<input ref={imageRef} type="file" id="image" name="image" accept="image/*" hidden onChange={onImageAdded} disabled={fileAdded}></input>
						<div className='w-full flex justify-center items-center'>
							<motion.label htmlFor="image" className='cursor-pointer text-lg  border-3 shadow-xl py-2 px-3 rounded-full overflow-hidden relative flex items-center justify-center' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring" }}>
								Pick Image
								<motion.span initial={{ height: "0%" }} animate={bgAnimationControls} layout className='absolute left-0 bottom-0 right-0 bg-black'></motion.span>
								<motion.svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check absolute" aria-hidden="true">
									<motion.path animate={checkAnimationControls} d="M4 12 9 17 20 6" initial={{ pathLength: 0, opacity: 0 }}></motion.path>
								</motion.svg> {/* Svg copied from Lucide-React */}
							</motion.label>
						</div>
						<div className='w-full h-[2px] mt-5.5 bg-stone-300/80' />
						<button type="submit" className='w-full flex mt-5 justify-center items-center'>
							<motion.div className='text-xl border-3 shadow-xl py-2 px-3 rounded-full cursor-pointer flex justify-center items-center gap-1' initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring" }}>
								<span>Submit</span>
								<ArrowRight size={30} className='relative translate-x-[3px] animate-bounce-right' />
							</motion.div>
						</button>
					</form>
					<p className='text-md text-nowrap text-center mt-2' style={{ color: msg.includes("Error") ? "#9e0000ff" : "#00cb00ff" }}>{msg}</p>
				</motion.div>
			</div>
		</motion.div>
	)
}

function Explore() {

	const [mediumDevice, setIsMediumDevice] = useState(window.innerWidth < 768);
	const [showExamples, setShowExamples] = useState(true);
	const [createCommunity, setCreateCommunity] = useState(false);

	const examples = [
		"Robotics",
		"Politics",
		"Architecture",
		"Photography",
		"Stuffed Animals"
	]

	const [exampleIndex, setExampleIndex] = useState(0);

	useEffect(() => {

		// Set medium device if width is greater than 768 pixels.
		const handleResize = () => {
			if (mediumDevice && window.innerWidth > 768)
				setIsMediumDevice(false);
			if (!mediumDevice && window.innerWidth < 768)
				setIsMediumDevice(true);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);

	}, [mediumDevice]);

	const [currentSearch, setCurrentSearch] = useState("");

	if (createCommunity) { // Render community creation form.

		return <CreateCommunityForm setCreateCommunity={setCreateCommunity} />

	}

	else {
		return (
			<div className='w-[100dvw] h-[calc(100vh-100px)]'>
				<div className='flex justify-center items-center flex-col gap-5 bg-stone-50 pt-[calc(38vh-100px)]'>
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { visualDuration: 1000 } }} className='text-nowrap text-5xl text-bold tracking-wide'>find your place</motion.div>
					<motion.div transition={{ visualDuration: 100, type: "spring" }} animate={{ width: mediumDevice ? '70%' : '45%' }} className='h-[50px] border-3 shadow-xl border-black rounded-full flex gap-2 justify-start items-center flex-row bg-white'>
						<Search className='ml-3' strokeWidth={3} />
						<div className='relative grow'>
							<TypewriterTextComponent examples={examples} showExamples={showExamples} exampleIndex={exampleIndex} setExampleIndex={setExampleIndex} />
							<form onSubmit={(e) => e.preventDefault()} >
								<input type="text" id="name" name="name" maxLength="75" autoCorrect="off" autoComplete="off" onChange={(e) => setCurrentSearch(e.target.value)} className='focus:outline-none text-center w-full text-lg' onClick={() => { setShowExamples(false); }} onBlur={() => { setShowExamples(currentSearch == ""); setExampleIndex(randomRange(0, examples.length - 1)); }} />
							</form>
						</div>
						<CirclePlus className='mr-3 ml-auto cursor-pointer' size={28} strokeWidth={2} onClick={() => setCreateCommunity(true)} />
					</motion.div>
				</div>
				<Communities currentSearch={currentSearch} mediumDevice={mediumDevice} />
			</div>
		)
	}
}

export default Explore;