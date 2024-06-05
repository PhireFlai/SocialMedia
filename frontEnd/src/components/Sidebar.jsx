import React from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import Logo from "../assets/Logo.png";


const category = [
    { name: "Animals" },
    { name: "Gaming" },
    { name: "Photography" },
    { name: "Programming" },
    { name: "Memes" },
    { name: "Other" },
]

const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';
const notActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const Sidebar = ({ user, closeToggle }) => {
    const handleCloseToggle = () => {
        if (closeToggle) closeToggle(false);
    }
    return (
        <div className='flex flex-col bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className='flex flex-col'>
                <Link
                    to="/"
                    className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
                    onClick={handleCloseToggle}
                >
                    <img src={Logo} alt="logo" className='w-full' />
                </Link>
            </div>

            <div className='flex flex-col gap-5'>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? isActiveStyle : notActiveStyle}
                    onClick={handleCloseToggle}
                >
                    <RiHomeFill />
                    Home
                </NavLink>
                
                {category.slice(0, category.length - 1).map((category) => (
                    <NavLink
                        to={`/category/${category.name}`}
                        className={({ isActive }) => isActive ? isActiveStyle : notActiveStyle}
                        onClick={handleCloseToggle}
                        key={category.name}
                    >
                        {/* category image */}
                        {category.name}
                    </NavLink>
                ))}

            </div>
            

                {user && (
                    <Link
                        to={`user-profile/${user._id}`}
                        className='flex my-5 mx-3 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mt-auto'
                        onClick={handleCloseToggle}

                    >
                        <img src={user.image} alt='userProfile' className='w-10 h-10 rounded-full ' />
                        <p>{user.userName}</p>

                    </Link>
                )}
            
        </div>
    )
}

export default Sidebar
