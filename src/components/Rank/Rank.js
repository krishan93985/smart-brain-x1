import React from 'react';

const Rank = ({name,entries}) => {
    return(
        <div className='mt5'>
        <div className='white f3'>
        {`${name}, your current entry count is...`}
       </div>
       <div className='white f1 mb4'>
        {`${entries}`}
       </div>
       </div>
    );
}

export default Rank;