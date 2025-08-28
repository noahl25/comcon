import React from 'react'

function Navbar() {

    return (
        <div className='fixed w-full h-[110px] bg-stone-100 overflow-hidden grid place-content-center'>
            <div className='absolute text-center align-middle absolute left-1/5 top-1/2 -translate-y-1/2 '>
                <p className='text-[45px] -translate-y-[3.5px]'>comcon</p>
            </div>
            <div className='mx-auto my-auto w-fit rounded-full flex gap-3 border-3 text-lg border-black bg-white py-2 px-5 tracking-wide'>
                <p>FEED</p>
                <p>EXPLORE</p>
            </div>
        </div>
    )

}

export default Navbar;