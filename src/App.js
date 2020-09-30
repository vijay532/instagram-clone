import React, { useState, useEffect} from 'react'
import './App.css'
import Posts from './Posts'
import {auth,db} from './firebase'
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles'
import { Button } from '@material-ui/core';
import ImageUpload from './ImageUpload'
function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  

function App() {

    const [posts,setPosts]=useState([]);
    
    const [open,setOpen]=useState(false);
    
    const [openSignIn,setOpenSignIn]=useState(false);

    const classes=useStyles();

    const [modalStyle]=useState(getModalStyle);
    
    const [email,setEmail]=useState('');
    
    const [password,setPassword]=useState('');
    
    const [username,setUsername]=useState('');

    const [user,setUser]=useState('');

   
    //     {
    //         username:"HeyBunny!",
    //         imageUrl:"https://www.codechef.com/download/cc_Homepage%20Banner.png",
    //         comments:"coding starts soon",
    //     },
    //     {
    //         username:"IamSanju",
    //         imageUrl:"https://cdn.staticans.com/image/data/being-human/size-charts/BHC-website_420x580-04.jpg",
    //         comments:"slipper for home"
    //     },
    //     {
    //         username:"Dbstudio",
    //         imageUrl:"https://cdn.staticans.com/image/tr:h-700,w-600,cm-pad_resize/catalog/brandstore/beinghuman/banner/bestseller1.jpg",
    //         comments:"WTF, shirt is!!!"
    //     }
    // ]);


    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                console.log(authUser);
                setUser(authUser);  //keep logged in when page refreshes    
                if(authUser.displayName){
                    // don't update the username
                }
                else{
                    // if we just created someone 
                    return authUser.updateProfile({
                        displayName:username,
                    });
                }
            }
            else{
                setUser(null);
            }
        })

        return ()=>{

            //perform the clean up
            unsubscribe();
        }

    },[user,username]);


    useEffect(() => {
        // run it once page refresh
        // onSnapshot is very powerful listener imagine of camera taking snapshot 
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{

            setPosts(snapshot.docs.map(doc=>({
                id:doc.id,
                post:doc.data()
            })));
        })
    }, []);

    const onSubmit=(e)=>{
        e.preventDefault();
        
        auth.
        createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
            return authUser.user.updateProfile({
                displayName:username

            })
        })
        .catch((error)=>alert(error.message));
    }


    const signIn=(e)=>{
        e.preventDefault();
        
        auth.signInWithEmailAndPassword(email,password)
        .catch((error)=>alert(error.message))

        setOpenSignIn(false);
    }
    return (
        <div className="app">
            {
                user?.displayName?<ImageUpload username={user.displayName}/>:
                <h3>Sorry,You need to login to upload</h3>
            }

            <Modal
                open={open}
                onClose={()=>setOpen(false)}
            >
            <div style={modalStyle} className={classes.paper}>
                {/* <h2 id="simple-modal-title">Text in a modal</h2>
                <p id="simple-modal-description">
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </p> */}
                <form className="app__signUp">
                    <center>
                        <div className="app__header">
                            <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
                        </div>
                    </center>
                    <input 
                        placeholder="username"
                        type="text"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                    <input 
                        placeholder="email"
                        type="text"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input 
                        placeholder="password"
                        type="password" 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button type="submit" onClick={onSubmit}>Sign up</Button>
                </form>
            </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={()=>setOpenSignIn(false)}
            >
            <div style={modalStyle} className={classes.paper}>
                {/* <h2 id="simple-modal-title">Text in a modal</h2>
                <p id="simple-modal-description">
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </p> */}
                <form className="app__signIn">
                    <center>
                        <div className="app__header">
                            <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
                        </div>
                    </center>
                    {/* <input 
                        placeholder="username"
                        type="text"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    /> */}
                    <input 
                        placeholder="email"
                        type="text"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input 
                        placeholder="password"
                        type="password" 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button type="submit" onClick={signIn}>Sign In</Button>
                </form>
            </div>
            </Modal>

            <div className="app__header">
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"/>
            </div>

            {user?
                <Button onClick={()=>auth.signOut()}>Log Out</Button>:
                (<div className="app__container">
                    <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>

                    <Button onClick={()=>setOpen(true)}>Sign up</Button>
                    
                </div>
                )
            }

            {
                posts.map(({id,post})=>(   
                    <Posts  key={id} username={post.username} comments={post.comments} imageUrl={post.imageUrl} />
                ))
            }
        </div>
    )
}

export default App
