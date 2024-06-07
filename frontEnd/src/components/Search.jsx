import React, { useState, useEffect } from 'react'

import MasonaryLayout from './MasonaryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'

import Spinner from './Spinner'

const Search = ({ searchTerm }) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const {query, params} = searchQuery(searchTerm.toLowerCase());

      client.fetch(query, params)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })

    } else {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
    }
  }, [searchTerm])
  return (
    <div>
      {loading && <Spinner message={"Searching for pins"} />}
      {pins?.length > 0 && <MasonaryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='text-center justify-center items-center font-bold text-2xl mt-10'>No Pins Found!</div>
      )}
    </div>
  )
}

export default Search
