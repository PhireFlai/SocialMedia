import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { client } from '../client';
import MasonryLayout from './MasonaryLayout.jsx'
import Spinner from "./Spinner"
import { feedQuery, searchQuery } from '../utils/data.js';

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);
  const { categoryId } = useParams();
  

  useEffect(() => {
    console.log(categoryId);
    setLoading(true);
    if(categoryId){
      const query = searchQuery(categoryId);
      client.fetch(query).then((data =>{

        setPins(data);
        setLoading(false);
        }
      ))
    }else{
        client.fetch(feedQuery).then((data) =>
        {
          setPins(data);
          setLoading(false);
        })
    }
  }, [categoryId])

  if (loading) return <Spinner message="Searching For Fresh Content!" />
  if (!pins?.length) return <h2 className='text-center justify-center items-center font-bold text-2xl mt-10'>No Pins for this Category Yet!</h2>
  return (
    
    <div>
      {/* {console.log(pins)} */}
      {pins && <MasonryLayout pins={pins} />}
      
    </div>
  )
}

export default Feed
