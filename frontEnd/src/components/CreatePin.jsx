import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'


import { client } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'



const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState('');
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/jpg' || type === 'image/gif' || type === 'image/tiff' || type === 'image/webp') {
      setWrongImageType(false);
      setLoading(true);
      client.assets.upload(
        'image',
        e.target.files[0],
        { contentType: type, filename: name }
      ).then((doc) => {
        setImageAsset(doc);
        setDestination(doc.url)
        setLoading(false);
      }).catch((error) => {
        console.log("Image Upload Error: " + error);
      })
    } else {
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if (!saving && title && about && destination && imageAsset?._id && category) {
      setSaving(true);
      const doc = {
        _type: 'pin',
        title,
        info: about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
            // url: imageAsset?.url,
          }
        },
        userID: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,

      }
      client.create(doc)
        .then(() => {
          setSaving(false);
          navigate("/");
        });
    }
    else {
      setFields(true);

      setTimeout(() => setFields(false), 5000);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>

      <div className=' min-w-210 flex lg:flex-row flex-col justify-center items-center bg-white p-3 lg:p-5 w-full lg:w-4/5 '>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className=' flex flex-col justify-center items-center border-2 border-dotted border-black p-3 w-full h-420'>
            {loading && (<Spinner />)}
            {wrongImageType && (<p>Wrong Image Type</p>)}
            {!imageAsset ? (
              <label className='cursor-pointer'>
                <div className='flex flex-col items-center justify-center h-full cursor-pointer'>
                  <div className='flex flex-col justify-center items-center'>

                    <p className='font-bold text-2xl p-2'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-Lg '>
                      Click to Upload
                    </p>
                  </div>


                </div>

                <p className='mt-auto text-gray-400 '>
                  JPG, SVG, PNG, GIF less than 20 MB
                </p>
                <input
                  type='file'
                  name='upload image'
                  onChange={uploadImage}
                  className='w-0 h-0' />
              </label>

            ) : (
              <div className='relative h-full object-contain'>
                <img src={imageAsset?.url} alt='uploaded pic' className='max-h-[400px]' />

                <button type='button'
                  onClick={() => {
                    setImageAsset(null)
                    setDestination('')
                  }}
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline=none hover:shadow-md transition-all duration-50'>
                  <MdDelete />
                </button>
              </div>
            )
            }
          </div>

        </div>

        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add Title'
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-400 p-2" />


          <input
            type='text'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='About Pinn'
            className="outline-none text-lg sm:text-xl font-bold border-b-2 border-gray-400 p-1" />

          <input
            type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination Link'
            className="outline-none text-lg sm:text-xl font-bold border-b-2 border-gray-400 p-1" />

          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-400 p-2 rounded-md cursor-pointer capitalize'>
                <option
                  value="other" className='bg-white'>Select Category</option>

                {categories.map((cat) => (
                  <option className=' text-base border-0 outline-none capitalize bg-white text-black' value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          {user && (
            <div className=' flex gap my-2 items-center bg-white rounded-lg'>
              <img src={user.image}
                className='w-10 h-10 rounded-full
              '
                alt='user Profile'
              />
              <p className='font-bold ml-4 text-lg'>
                {user.userName}
              </p>
            </ div>
          )}

          {fields && (
            <p
              className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'
            >
              Please Fill All Fields
            </p>

          )}

          <div className='flex justify-end items-end '>
            <button onClick={savePin} className='bg-red-500 text-white font-bold p-2 rounded-full w-20'>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
