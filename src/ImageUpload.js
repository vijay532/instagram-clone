import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {db,auth,storage} from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'
function ImageUpload({username}) {

    const [comments,setComments]=useState('');
    const [image,setImage]=useState(null);
    const [url,setUrl]=useState('');
    const [progress,setProgress]=useState(0);

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload=(e)=>{

        const uploadTask=storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                // progress function behaviour of progress bar ....
                const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                setProgress(progress);  
            },

            (error)=>{
                // error function.....  
                console.log(error);
                alert(error.message);
            },

            ()=>{
                //complete function.......

                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        // post image on db 
                        db.collection("posts").add({
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            comments:comments,
                            imageUrl:url,
                            username:username

                        });

                        setProgress(0);
                        setImage(null);
                        setComments('');


                    })
            }

        )
    }

    return (
        <div className="imageUpload">
            {/* <h1>abc</h1>
            {file uploader}
            {choose file}
            {button for upload} */}

            <progress className="imageUpload__progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter the captions...." onChange={(e)=>setComments(e.target.value)} />
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
