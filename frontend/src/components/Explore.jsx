import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react'

function Explore() {

  const [mediumDevice, setIsMediumDevice] = useState(window.innerWidth < 768);

  useEffect(() => {

    const handleResize = () => {
      if (mediumDevice && window.innerWidth > 768)
        setIsMediumDevice(false);
      if (!mediumDevice && window.innerWidth < 768)
        setIsMediumDevice(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [mediumDevice]);

  return (
    <div className='w-[100dvw] h-[calc(100vh-100px)] flex justify-center items-center flex-col'>
      <motion.div layout transition={{ visualDuration: 100 }} animate={{ width: mediumDevice ? '70%' : '45%' }} className='h-[50px] border-3 border-black rounded-full flex justify-start items-center flex-row'>
        <Search className='ml-3' strokeWidth={3}/>
      </motion.div>

    </div>
  )
}

export default Explore;