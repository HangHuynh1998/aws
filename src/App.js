import {withAuthenticator} from 'aws-amplify-react'
import React, { Component } from 'react';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import '@aws-amplify/ui/dist/style.css';
import { API, graphqlOperation, input } from 'aws-amplify';
import {createNote, deleteNote, updateNote} from './graphql/mutations'
import {listNotes} from './graphql/queries'
class App extends Component {
  state={
    id:"",
    note:"",
    notes:[]
  }
  async componentDidMount(){
    const result= await API.graphql(graphqlOperation(listNotes));
    this.setState({notes:result.data.listNotes.items})
  }
  handleChangnote=event=>{
    this.setState({note:event.target.value})
  }
  hasExistingNote=()=>{
    const {notes,id}=this.state
    if(id){
      //is the id a valid id?
      const isNote=notes.findIndex(note=>note.id===id)>-1
      return isNote
    }
    return false;
  }
  handleAddnote= async event=>{
    event.preventDefault();
    const {note,notes}=this.state;
    if(this.hasExistingNote()){
      this.handleUpdateNote();
    }else{
    const input={note}
    const result=await API.graphql(graphqlOperation(createNote,{input}));
    const newNote=result.data.createNote;
    const updateNote=[newNote,...notes];
    this.setState({notes:updateNote, note:""})
    }

  }
  handleUpdateNote= async ()=>{
    const {id,note,notes}=this.state
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
      this.setState({notes:updateNote, note:"",id:""})
    }
      
  }
  handleSetNote=({note,id})=>this.setState({note,id})

  handleDeleteNote=async (noteId)=>{
    const {notes}=this.state
    const input={id:noteId}
    const response =await API.graphql(graphqlOperation(deleteNote,{input}))
   console.log(response);
    const deleteId=response.data.deleteNote.id;
    const updateNote=notes.filter(note=>note.id!==deleteId)
   this.setState({notes:updateNote})
  }
  render() {
    const {id,notes,note}=this.state
    return (
      <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
        {/* <AmplifySignOut></AmplifySignOut> */}
      <h1 className="code f2-1">Amplify Notetaker</h1>
      {/* NoteForms */}
      <form className="mb3" onSubmit={this.handleAddnote}>
        <input type="text" className="pa2 f4" placeholder='Write your note' onChange={this.handleChangnote} value={note}/>
    <button className="pa2 f4" type="submit">{id?"Update Note":"Add note"}</button>
      </form>
      {/* Note Lists */}
      <div>
        {notes.map((item)=>{
          return <div key={item.id} className='flex items-center'>
            <li className='list pa1 f3'onClick={()=>this.handleSetNote(item)}>
              {item.note}
            </li>
            <button onClick={()=>this.handleDeleteNote(item.id)} className='bg-transparent bn f4' >
              <span>&times;</span>
            </button>
          </div> 
        })}
      </div>
      </div>
    );
  }
}

export default withAuthenticator(App,true);

