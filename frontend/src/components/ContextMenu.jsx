import { motion } from "framer-motion"

export const ContextMenu = ({ x, y, options}) => {

    return <motion.div 
        className="context-menu absolute w-[200px] border-3 border-black bg-white rounded-2xl bg-black z-1000000" 
        style={{ left: x, top: y + window.scrollY }}
        initial={{
            scale: 0
        }}
        animate={{
            scale: 1
        }}
        exit={{
            scale: 0,
            transition: {
                ease: "easeInOut"
            }
        }}
        transition={{
            type: "spring",
            stiffness: 80,
            bounce: 1
        }}
        layout
    >
        {
            options.map((item, index) => {
                return <div 
                    key={index} 
                    onClick={item.action} 
                    className="flex gap-2 justify-start items-center p-3 w-full transition-all duration-500 ease-in-out border-b-2 border-b-stone-300 last:border-b-0"
                    onMouseEnter={e => e.currentTarget.style.color = item.hover}
                    onMouseLeave={e => e.currentTarget.style.color = ""} 
                >
                    {item.icon}
                    <span className="text-lg relative translate-y-[0.5px]">{item.name}</span>
                </div>
            })
        }
    
    </motion.div>

}