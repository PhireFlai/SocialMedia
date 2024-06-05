import React, { useState } from 'react'
import { urlFor } from '../client'
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsfillArrowUpRIghtCircleFill } from 'react-icons/bs'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ key, pin: { postedBy, image, _id, destination, save} }) => {
    const [postHover, setPostHover] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    
    const userInfo = fetchUser();

    const alreadySaved = save?.filter((item) => item.postedBy.id === userInfo.sub)
    const navigate = useNavigate();

    return (
        <div className='m-2'>

            <div
                onMouseLeave={() => setPostHover(false)}
                onMouseEnter={() => setPostHover(true)}
                onClick={() => navigate(`/pin-detail/${_id}`)}

                // this allows downloads
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'>

                {postHover && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-100'>
                        <div className='flex items-center justify-start'>
                            <div className='flex gap-2'>
                                <a href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}>
                                    <MdDownloadForOffline className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl bg-opacity-80' />
                                </a>
                            </div>
                        </div>
                    </div>)
                }


                {alreadySaved?.length !== 0 ? (
                    <button>
                        Saved
                    </button>
                ) :
                    <button>
                        Save
                    </button>
                }


                <img className='rounded-lg w-full' alt='user post' src={urlFor(image).width(250).url()} />
            </div>
        </div>

    )
}

export default Pin
