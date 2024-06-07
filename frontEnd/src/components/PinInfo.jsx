import React, { useEffect, useState, userEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { IoMdAdd } from 'react-icons/io';

import { client, urlFor } from "../client";
import MasonaryLayout from './MasonaryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner';
const PinInfo = ({ user }) => {

  const [pins, setPins] = useState(null);
  const [comment, setComment] = useState('');
  const [pinDetail, setPinDetail] = useState(null);
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();




  const fetchPinDetails = () => {
    
    const { query, params } = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query, params).then((data) => {
        setPinDetail(data[0]);
        
        if (data[0]) {
          const { query, params } = pinDetailMorePinQuery(data[0]);
          console.log(query);
          client.fetch(query, params).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client.patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id

          },
        }]).commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })

    }
  }


  if (!pinDetail) return <Spinner message='loading Pin' />
  return (

    <div className='flex flex-col xl:flex-row m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>

      <div className='flex justify-center items-center md:items-start flex-initial'>
        <img src={pinDetail?.image && urlFor(pinDetail.image).url()} className='rounded-3xl' />
      </div>

      <div className=' w-full p-5 flex-1 xl:min-w-620'>

        <div className=' flex justify-between items-center '>

          <div className='flex gap-2 items-center '>

            <a href={`${pinDetail.image.asset.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}>
              <MdDownloadForOffline className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl bg-opacity-50 hover:shadow-md hover:bg-opacity-100' />
            </a>

          </div>

          <a
            href={pinDetail.destination}
            target="_blank"
            rel="noreferrer"
            className='bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-lg opacity-80 hover:opacity-100 hover:shadow-md break-all'>
            {pinDetail.destination}
          </a>

        </div>

        <div>
          <h1 className='text-3xl font-bold break-words mt-3'>
            {pinDetail.title}
          </h1>

          <p className='mt-4'>
            {pinDetail.info}

          </p>


          <Link to={`user-profile/${pinDetail.postedBy?._id}`} className='flex gap-2 mt-4 ml-auto items-center'>
            <img
              src={pinDetail.postedBy?.image}
              className='w-8 h-8 rounded-full object-cover' />
            <p className='font-semibold capitalize'>{pinDetail.postedBy?.userName}</p>
          </Link>

          <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${pinDetail.postedBy?._id}`} className='flex ml-auto items-center'>
              <img
                src={pinDetail.postedBy?.image}
                className='w-10 h-10 rounded-full object-cover' />

            </Link>

            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Comment Here'
              className='flex-1 border-gray-100 outline-none border-2 p-3 rounded-2xl focus:border-gray-500'>
            </input>

            <button
              onClick={addComment}
              type="button"
              className=' bg-gray-300 rounded-xl text-white px-6 py-2 font-semibold text-base outline-none'>
              {addingComment ? 'posting Comment' : "Post"}

            </button>

          </div>

          <h2 className='mt-8 text-2xl'>
            Comments
          </h2>
          <div className='max-h-370 overflow-y-auto'>

            {pinDetail?.comments?.map((comment, i) => (
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>

                <img src={comment.postedBy.image}
                  alt='posted profile'
                  className='w-10 h-10 rounded-full cursor-pointer ' />

                <div className='flex flex-col'>

                  <p className="font-bold">
                    {comment?.postedBy?.userName}
                  </p>

                  <p>
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>



        </div>


      </div>


      {

        pins?.length ? (
          <>
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
              More like this
            </h2>
            <MasonaryLayout pins={pins} />
          </>
        )

          : (
            <Spinner message="Loading more pins" className="mt-8" />
          )
      }
    </div>



  )
}


export default PinInfo
