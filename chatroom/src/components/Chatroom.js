import React, { useState, useEffect} from 'react';

import { app, firestore, auth, analytics, storage, database } from "../firebase.js";

import { QuerySnapshot, collection, getDocs, onSnapshot,addDoc,orderBy ,query, doc, updateDoc  } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {  ref as dbRef, child, get, set, onDisconnect } from "firebase/database";





function Chatroom (){

const [text, setText] = useState("")
const [userId, setUserId] = useState("")
const [localMessages, setLocalMessages] = useState([])
const [localImage, setLocalImage] = useState(null)
const adminList = ["7hN0TqCYbXUP7Dy01ewiJQ4VyLz2"]


const getFireStoreData = async () => {


setUserId(auth?.currentUser?.uid)
const chatCollection = collection(firestore, 'Chats');

const chatsQuery = query(collection(firestore, "Chats"), orderBy("timestamp", "asc"));

onSnapshot(chatsQuery, (snapshot) => {
let messages = [];

snapshot.docs.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        messages.push({ mid: doc.id, ...doc.data() });
    })
    setLocalMessages(messages)
})

//Below code related to realtime database
if(auth?.currentUser?.uid){
    const usersDBRef = dbRef(database);
    get(child(usersDBRef, `users`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            const usersData = snapshot.val();
            const userIds = usersData ? Object.keys(usersData) : [];

            //if(!userIds.includes(auth?.currentUser?.uid)){
                 set(dbRef(database, 'users/' + auth?.currentUser?.uid), {
                    online: true
                  });
           // } 

          
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
}

//This turns off the online status
const presenceRef = dbRef(database, `users/${auth?.currentUser?.uid}/online`);
// Write a string when this client loses connection
onDisconnect(presenceRef).set(false);


};


useEffect ( () => {

getFireStoreData();

},[]);




return (
<div>
<div style={{display:'flex', flex:1, height:'100vh', flexDirection:'column'}}>
<div style={{flex:1, marginLeft:24, marginRight:24, overflow: 'auto', marginBottom: 24}}>
    {localMessages.map((localMessage) => (
            <div style={{display: 'flex', flex:1, justifyContent: userId === localMessage.uid ? 'flex-end' : 'flex-start'}}>
            <div style={{
                minHeight: 52,
                width:600,
                backgroundColor: userId === localMessage.uid? '#29bcff'  : (localMessage.like === true ? 'yellow': 'tomato'),
                marginTop:24,
                paddingLeft: 24,
                paddingRight:24,
                borderRadius: 12
            }}>
                <p>{localMessage.content}</p>
                {
                localMessage?.image && localMessage.image.length > 0 &&
                <img style={{width: '100%', height:'auto', marginBottom:24}} src={localMessage.image}></img>
                }
                {(userId !== localMessage.uid) && (adminList.includes(userId)) && (localMessage.like !== true) &&
                <button style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: 22,
                    marginBottom: 24,
                    borderWidth: 0,
                    fontWeight: 'bold',
                    borderRadius: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                }} onClick={async () => {
                    const messageUpdateRef = doc(firestore, "Chats", localMessage.mid);

                    await updateDoc(messageUpdateRef, {
                        like: true
                      });


                }}>Like</button> }
            </div>
        </div>
    ))}
</div>

<button style={{
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    borderWidth: 0
}} onClick={async () => {
    set(dbRef(database, 'users/' + auth?.currentUser?.uid), {
        online: false
      });
    auth.signOut();
}}>Sign out</button>

<div style={{display:'flex', flexDirection:'row', marginTop:24}}>
    <form style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1}}
        onSubmit={async (e) => {

            console.log('submit called');


            e.preventDefault();

            
            const timestamp = Date.now();
            let image = ''
            const content = text;
            const uid = userId;

            const like = false;

            if(localImage){
                const uniqueLocalImage = `${localImage.name}_${Math.random().toString(36)}`

                const newImageStorageRef = ref(storage, uniqueLocalImage);

                // 'file' comes from the Blob or File API
                const uploadTask = uploadBytes(newImageStorageRef, localImage).then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    getDownloadURL(ref(storage, uniqueLocalImage)).then((url) => {
                        const message = {content, timestamp, uid, image: url, like}
                        const docRef = addDoc(collection(firestore,"Chats"),(message));
                    })

                    
                    

                });

                //const uploadTask = storage.ref(`/images/${uniqueLocalImage}`).put(localImage)

                // uploadTask.on('state_changed',
                // () => {},
                // () => {},
                // async () => {  
                // })
            }else {
                const message = {content, timestamp, uid, image, like}
                const docRef = addDoc(collection(firestore,"Chats"),(message));
            }

            setText("")
            setLocalImage(null)
        }}>

    
    <input style={{flex:11, height:32, fontSize: 28}} type='text'
        value={text} onChange={(value) => {
            setText(value.target.value)
        }} />

        <input
            key={Date.now()}
            style={{ flex: 1}}
            type='file'
            onChange={ (e) => {
                const image = e.target.files[0]
                setLocalImage(image);
            }}
        />

    <button type='submit' style={{
        flex: 1,
        backgroundColor: 'blue',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        borderWidth: 0
    }} >Send</button>

</form>
</div>

</div>
</div>
)
}

export default Chatroom;