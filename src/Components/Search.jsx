import React from 'react'
import './Search.css'
const Search = ({SearchTerm,setSearchTerm}) => {
  return (
   <div className="search">
    <div>
        <img src="./look-up-svgrepo-com.svg" alt="search icon" />
        <input className='placeholder-text' type="text" placeholder='search through 1000 movies' value={SearchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
       
    </div>
   </div>
  )
}

export default Search