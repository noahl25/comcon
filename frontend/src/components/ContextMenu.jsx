import { motion } from "framer-motion"

export const ContextMenu = ({ x, y, options}) => {

    return <motion.div 
        className="context-menu absolute w-[200px] border-3 border-black bg-white rounded-2xl bg-black" 
        style={{ left: x, top: y }}
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
                return <div key={index} onClick={item.action} className="flex gap-2 justify-start items-center p-2 w-full hover:text-red-500 transition-all duration-500 ease-in-out">
                    {item.icon}
                    <span className="text-lg relative translate-y-[0.5px]">{item.name}</span>
                </div>
            })
        }
    
    </motion.div>

}