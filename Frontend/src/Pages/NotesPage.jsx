import React from 'react'
import Header from '../components/header';
import Footer from '../components/Footer';
import CreateArea from '../components/createArea';
import Note from '../components/note';

const NotesPage = () => {
  const [notes, setNotes] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3000/api/notes",{
        method:"GET",
        headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setNotes(data)
      })
      .catch(err => console.error("Error fetching notes:", err));
  }, [])

  function AddNote(note) {
    fetch("http://localhost:3000/api/notes",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify(note)
    })
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
      setNotes((prevnote) => {
        return [...prevnote,data];
      });
    })
    .catch(err=>{
      console.error("error in adding");
    })
    
  }

  function DeleteNote(id) {
    console.log(id)
    const userConfirmed = window.confirm("Are you sure you want to delete this note?");
    if(userConfirmed){

      fetch(`http://localhost:3000/api/notes/${id}`,{
        method:"DELETE",
        headers:{
          "content-type":"application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      })
      .then(response=>response.json())
      .then(()=>{
        setNotes((prevnote) => prevnote.filter((noteitem) => noteitem.id !== id))
      })
      .catch(err=> console.error("djhdbfhbf"))
    }
  }

  return (
    <div>
      <CreateArea addnote={AddNote} />
      {notes.map((noteitem, index) => {
        return (
          <Note
            key={noteitem.id}
            id={noteitem.id}
            title={noteitem.title}
            message={noteitem.message}
            date={noteitem.timestamp}
            deletenote={DeleteNote}
          />
        );
      })}

    </div>
  );
}

export default NotesPage
