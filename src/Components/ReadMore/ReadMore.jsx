import React from 'react'

function ReadMore({text}) {

  return <>
    {text.length>100?
     <>
        {text.slice(0,100)+'...'}
         <span style={{color:'blue'}} className='ms-2'>Read More</span> 
     </>
     :
     text}
  
  
  
  </>
}

export default ReadMore