import React, { useEffect, useState } from 'react'
import './Posts.css'
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase'
import { Button } from '@material-ui/core';
import firebase from 'firebase'
function Posts({user,postId,username,imageUrl,caption,}) {

    const [describe,setDescribe]=useState([]);

    const [comment,setComment]=useState('');

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("description")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setDescribe(snapshot.docs.map((doc)=>doc.data()));
            });
        }
        return ()=>{
            unsubscribe();
        };
    },[postId]);

    const postComment=(event)=>{
        event.preventDefault();
        db.collection("posts").doc(postId).collection("description").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }
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
            <h4 className="posts__text"><strong>{username}</strong> {caption}</h4>
            <div className="posts__comments">                
                {describe.map((comment)=>(
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                    
                ))
                }
                
            </div>

            {user && <form className="posts__commentBox">
                <input 
                className="posts__input"
                type="text"
                placeholder="Add a comment....."
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                />

                <button
                className="posts__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
                >
                    posts
                </button>
            </form>
            }
        </div>
    )
}

export default Posts
