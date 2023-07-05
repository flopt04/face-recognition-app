import React from 'react';


const FaceRecgonition = ({imageUrl}) => {
    return (
    <div className='center ma'>
        <div className='absolute mt2'>
        <img id='inputimage' src={imageUrl} alt='' width='500px' height='auto'></img>
        </div>
    </div>
    );
}

export default FaceRecgonition;