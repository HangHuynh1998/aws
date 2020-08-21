import {withAuthenticator} from 'aws-amplify-react'
import React, { useState, useEffect } from 'react';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import '@aws-amplify/ui/dist/style.css';
import { API, graphqlOperation, input } from 'aws-amplify';
import {createNote, deleteNote, updateNote} from './graphql/mutations'
import {listNotes} from './graphql/queries'
const App =()=>{

const [id, setId]=useState("")
const [note, setNote]=useState("")
const [notes,setNotes]=useState([])
//   async componentDidMount(){
//     const result= await API.graphql(graphqlOperation(listNotes));
//     this.setState({notes:result.data.listNotes.items})
//   }
 useEffect(async()=>{
    const result= await API.graphql(graphqlOperation(listNotes));
    setNotes(result.data.listNotes.items)
 },[])
 const handleChangNote=event=>{
    setNote(event.target.value)
  }
 const hasExistingNote=()=>{
    if(id){
      //is the id a valid id?
      const isNote=notes.findIndex(note=>note.id===id)>-1
      return isNote
    }
    return false;
  }
const handleAddnote= async event=>{
    event.preventDefault();
    if(hasExistingNote()){
      handleUpdateNote();
    }else{
    const input={note}
    const result=await API.graphql(graphqlOperation(createNote,{input}));
    const newNote=result.data.createNote;
    const updateNote=[newNote,...notes];
    setNotes(updateNote)
    setNote("")
    }

  }
 const handleUpdateNote= async ()=>{
    const input={id,note}
    const result= await API.graphql(graphqlOperation(updateNote,{input}))
    const updatedNotes=result.data.updateNote
    const index=notes.findIndex(note=>note.id===updatedNotes.id)
    if(updatedNotes){
      const updateNote=[
        ...notes.slice(0,index),
         updatedNotes,
        ...notes.slice(index+1),
      ]
      setNotes(updateNote)
      setNote("")
      setId("")
    }
      
  }
 const handleSetNote=({note,id})=>{
     setNote(note)
     setId(id)
 }

 const handleDeleteNote=async (noteId)=>{
    const input={id:noteId}
    const response =await API.graphql(graphqlOperation(deleteNote,{input}))
   console.log(response);
    const deleteId=response.data.deleteNote.id;
    const updateNote=notes.filter(note=>note.id!==deleteId)
   setNotes(updateNote)
  }
    return (
      <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
        {/* <AmplifySignOut></AmplifySignOut> */}
      <h1 className="code f2-1">Amplify Notetaker</h1>
      {/* NoteForms */}
      <form className="mb3" onSubmit={handleAddnote}>
        <input type="text" className="pa2 f4" placeholder='Write your note' onChange={handleChangNote} value={note}/>
    <button className="pa2 f4" type="submit">{id?"Update Note":"Add note"}</button>
      </form>
      {/* Note Lists */}
      <div>
        {notes.map((item)=>{
          return <div key={item.id} className='flex items-center'>
            <li className='list pa1 f3'onClick={()=>handleSetNote(item)}>
              {item.note}
            </li>
            <button onClick={()=>handleDeleteNote(item.id)} className='bg-transparent bn f4' >
              <span>&times;</span>
            </button>
          </div> 
        })}
      </div>
      </div>
    );
  }
export default withAuthenticator(App,true);

