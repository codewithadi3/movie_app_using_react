import React,{useState,useEffect} from "react";


const Movies = ({title})=>{
    const [count,setCount]  = useState(0);
    const [hasLiked,setHasLiked] = useState(false);

    useEffect(()=>{
        console.log(`${title} has been liked : ${hasLiked}`);
    },[hasLiked]);
    return(
        <div className="card" onClick={()=>setCount((prevState)=>prevState+1)}>
            <h2>{title} <br /> {count|| null}</h2>
            <button onClick={()=>setHasLiked(!hasLiked)}>{hasLiked?"❤️":"🤍"}</button>
        </div>
    )
}

export default Movies