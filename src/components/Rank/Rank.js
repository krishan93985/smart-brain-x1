import React, {useState, useEffect} from 'react';

const Rank = ({name,entries}) => {
    const [emoji,setEmoji] = useState('');

    const getEmoji = () => {
        fetch(`https://${process.env.REACT_APP_RANK_URL}?rank=${entries}`)
        .then(res => res.json())
        .then(data => setEmoji(data.input))
        .catch(console.log)
    }

    useEffect(() => {
        getEmoji();
    })

    return(
        <div className='mt5'>
        <div className='white f3'>
        {`${name}, your image submission count is...`}
       </div>
       <div className='white f1'>
        {`${entries}`}
       </div>
       <div className='white f3'>
        {`Rank Badge : ${emoji}`}
       </div>
       </div>
    );
}

export default Rank;