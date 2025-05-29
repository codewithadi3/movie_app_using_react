import { useState, useEffect} from "react";
import Search from "./Components/Search";
import Spiiner from "./Spiiner";
import MovieCard from "./Components/MovieCard";
import {useDebounce} from 'react-use';
import { updateSearchCount,getTrendingMovies } from "./appwrite";



const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS ={
  method : 'GET',
  headers : {
    accept : 'application/json',
    Authorization : `Bearer ${API_KEY}` 
  }
}


function App() {
  const [debounceSearchTerm,setDebounceSearchTerm] =  useState('');
  const [SearchTerm,setSearchTerm] = useState('');

  const [movieList,setMovieList] = useState([]);
  const [errorMessage,setErrorMessage] = useState('');
  const [isLoading,setIsLoading] = useState(false);
  
  const [trendingMovies,setTrendingMovies] =  useState([]);
  //try to write error and isloading usestate for the trending movies.
    useDebounce(()=>setDebounceSearchTerm(SearchTerm),500,[SearchTerm])
    const fetchMovies = async(query='') =>{
      setIsLoading(true);
      setErrorMessage('');
      try{
          const endpoint = query ?  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
          const response = await fetch(endpoint,API_OPTIONS);
          if(!response.ok){
              throw new Error('Failed to fetch movies');
          }
      const data = await response.json();
          if(data.Response=='False'){
            setErrorMessage(data.Error || 'Failed to fetch movies');
            setMovieList([]);
            return;
          }
          setMovieList(data.results || []);
        if(query && data.results.length>0){
          await updateSearchCount(query,data.results[0]);
        }
          
      }
      catch(error){
        console.error(`error fetching movies : ${error}`)
        setErrorMessage('Error fetching movies. please try again.');
      }
      finally{
        setIsLoading(false);
      }
    }
    const loadTrendingMovies = async()=>{
      try{
        const movies =  await getTrendingMovies();
        setTrendingMovies(movies);
      }
      catch(error){
        console.log(error)
      }
    }
    useEffect(()=>{
      fetchMovies(debounceSearchTerm);
    },[debounceSearchTerm]);

    useEffect(()=>{
      loadTrendingMovies();
    },[])
 return(
<>
{/* <h2>functional components</h2>
<div className="card-container">
  <Movies title="Star wars"/>
<Movies title="lion king" />
<Movies title="avatar"/>
</div> */}
<main>
  <div className="pattern">
  <div className="wrapper">
    <header>
      <img src="./icon.jfif" alt="" className="icon" />
      <h1>find <span className="text-gradient">movies</span> you'll enjoy movies with out the hustle</h1>
       <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm} />
    </header>
    {trendingMovies.length>0&&(
      <section className="trending">
        <h2>Trending movies</h2>
        <ul>
          {trendingMovies.map((movie,index)=>(

            <li key={movie.$id}>
              <p>{index+1}</p>
              <img src={movie.poster_url} alt={movie.title}/>
            </li>
          ))}
        </ul>
      </section>
    )}
  <section className="all-movies">

    <h2>All movies</h2>

    {isLoading?(
      <Spiiner/>
        ):errorMessage?(
      <p className="text-red-500">{errorMessage}</p>
        ):(
      <ul>
        {movieList.map((movie)=>(
         <MovieCard key = {movie.id} movie={movie}/>
        ))}
      </ul>
    )}
  </section>
  </div>
</div>
</main>

</>

 );
}

export default App
