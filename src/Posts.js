import React, { useState } from 'react'
import './Posts.css'
import Avatar from '@material-ui/core/Avatar';
function Posts({username,imageUrl,comments}) {

    const [comments,setComments]=useState([]);
    return (
        <div className="posts">
            <div className="posts__header">
            {/* header */}
                <Avatar
                className="posts__avatar"
                alt={username}
                src="/static/images/avatar/1.png"
                />

                <h3 className="posts__user">{username}</h3>
            </div>
            
            {/* image */}            
            <img className="posts__img" src={imageUrl}/>
            

            
            {/* username+caption*/}

            <h4 className="posts__text"><strong>{username} </strong>{comments}</h4>
        </div>
    )
}

export default Posts
