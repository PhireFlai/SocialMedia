import React, { useState } from 'react'
import { urlFor } from '../client'
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { fetchUser } from '../utils/fetchUser';
import { client } from '../client';

const Pin = ({ key, pin: { postedBy, image, _id, destination, save } }) => {
    const [postHover, setPostHover] = useState(false);

    const userInfo = fetchUser();

    const alreadySaved = (save?.filter((item) => item.postedBy._id === userInfo.sub))?.length > 0;

    const savePin = (_id) => {
        if (!alreadySaved) {
            client.patch(_id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userID: userInfo.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: userInfo.sub,
                    }
                }]).commit()
                .then(() => {
                    window.location.reload();
                });
        }
    }

    const deletePin = (_id) => {
        client.delete(_id).then(() => {
            window.location.reload();
        })
    }
    const navigate = useNavigate();

    return (
        <div className='m-2'>

            <div
                onMouseLeave={() => setPostHover(false)}
                onMouseEnter={() => setPostHover(true)}
                onClick={() => navigate(`/pin-info/${_id}`)}

                // this allows downloads
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'>

                {postHover && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-100'>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}>
                                    <MdDownloadForOffline className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl bg-opacity-50 hover:shadow-md hover:bg-opacity-100' />
                                </a>


                            </div>
                            {alreadySaved ? (
                                <button onClick={(e) => e.stopPropagation()} type='button' className='bg-red-500 opacity-80 hover:opacity-100 hover:shadow-md text-white font-bold px-5 py-1 text-base rounded-lg outline-none' >
                                    {save?.length} Saved
                                </button>
                            ) :
                                <button onClick={(e) => { e.stopPropagation(); savePin(_id); }} type='button' className='bg-red-500 opacity-80 hover:opacity-100 hover:shadow-md text-white font-bold px-5 py-1 text-base rounded-lg outline-none' >
                                    Save
                                </button>
                            }

                        </div>

                        <div className="flex justify-between items-center gap-2 w-full">
                            {destination && (
                                <a
                                    href={destination}
                                    target="_blank"
                                    rel="noreffer"
                                    className='bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-lg opacity-80 hover:opacity-100 hover:shadow-md'>
                                    <BsFillArrowUpRightCircleFill onClick={(e) => e.stopPropagation()} />
                                </a>
                            )}



                            {postedBy?._id === userInfo.sub && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id)
                                    }}
                                    className='bg-white opacity-80 hover:opacity-100 hover:shadow-md text-dark font-bold px-5 py-1 text-base rounded-lg outline-none'
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>)}

                <img className='rounded-lg w-full' alt='user post' src={urlFor(image).width(250).url()} />
            </div>

            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img
                    src={postedBy?.image}
                    className='w-8 h-8 rounded-full object-cover' />
                <p className='font-semibold capitalize'>{postedBy?.userName}</p>

            </Link>

        </div>



    )
}





export default Pin
