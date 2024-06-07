import React, { useState, useRef, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';

import { Sidebar, UserProfile } from '../components';
import { client } from '../client';
import Logo from "../assets/Logo.png";
import Pins from '../components/Pins';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';

import { Navigate } from 'react-router-dom';
const Home = () => {

  const userInfo = fetchUser();
  // console.log(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!userInfo) {
    navigate('/login')
  }


  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);



  useEffect(() => {
    const {query, params} = userQuery(userInfo?.sub);
    client.fetch(query, params)
      .then((data) => {
        setUser(data[0]);
        // console.log(user);
      })

  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (



    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      {/* desktop sidebar */}
      <div className='hidden md:flex h-screen, flex-initial'>
        <Sidebar user={user && user} />
      </div>


      {/* mobile sidebar */}
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={Logo} alt='logo' className='w-28' />
          </Link>

          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt='logo' className='w-20 rounded-full' />
          </Link>
        </div>


        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}

      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />

        </Routes>
      </div>
    </div>
  )
}

export default Home
