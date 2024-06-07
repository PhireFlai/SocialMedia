import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'



import { userQuery, userSavedPinsQuery, userCreatedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonaryLayout from './MasonaryLayout'
import Spinner from './Spinner'
const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,wallpapers'

const activeBtnStyle = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
const notActiveStyle = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [actBtn, setActBtn] = useState('Created');

  const navigate = useNavigate();
  const { userId } = useParams();

  const logout = () => {
    localStorage.clear();

    navigate('/login')
  }

  useEffect(() => {
    const { query, params } = userQuery(userId);

    client.fetch(query, params).
      then((data) => {
        setUser(data[0]);
      })

  }, [userId])

  useEffect(() => {
    if (text === 'Created') {
      const { query, params } = userCreatedPinsQuery(userId)

      client.fetch(query, params)
        .then((data) => {

          setPins(data);
        })
    } else {
      const { query, params } = userSavedPinsQuery(userId)

      client.fetch(query, params)
        .then((data) => {
          setPins(data);
        })


    }
  }, [text, userId]);
  if (!user) {
    return <Spinner message="Loading Profile" />
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>

        <div className='relative flex flex-col mb-7'>

          <div className='flex flex-col justify-center items-center'>

            <img src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt='random banner pic' />

            <img src={user.image}
              className='rounded-full w-30 h-30 -mt-10 shadow-xl object-cover'
              alt='User profile pic' />
            <h1
              className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>


            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user._id && (
                <button type='button'
                  className='flex flex-row bg-white shadow-lg justify-center items-center rounded-md p-1 opacity-60 hover:opacity-100 hover:shadow-lg'
                  onClick={logout}
                >
                  <AiOutlineLogout className='w-10 h-10' />
                  <p className=' font-semibold'>
                    Logout
                  </p>
                </button>
              )}

            </div>
          </div>

          <div className='text-center mb-7'>
            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActBtn('Created');
              }}
              className={`${actBtn}` === 'Created' ? activeBtnStyle : notActiveStyle}>
              Created
            </button>

            <button
              type='button'
              onClick={(e) => {
                setText(e.target.textContent);
                setActBtn('Saved');
              }}
              className={`${actBtn}` === 'Saved' ? activeBtnStyle : notActiveStyle}>
              Saved
            </button>
          </div>
          {pins?.length > 0 ? (
            < div className='px-2'>
              <MasonaryLayout pins={pins} />
            </div>) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-5'>
              No Pins Found!
            </div>

          )
          }

        </div>

      </div>

    </div >
  )
}

export default UserProfile
