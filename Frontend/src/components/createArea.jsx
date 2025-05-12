import React from "react";

function CreateArea(props) {
  const [note, setnote] = React.useState({
    title: "",
    message: "",
  });

  function HandleChange(event) {
    const { name, value } = event.target;
    setnote((prevnote) => {
      return { ...prevnote, [name]: value };
    });
  }
   function sumbitnote(event) {
    if(note.title.trim()&&note.message.trim()){
      note.date=new Date().toLocaleTimeString()
      console.log(note.date)
      props.addnote(note);
    }
    event.preventDefault();
   }
 
  

  return (
    <div>
      <form>
        <input
          onChange={HandleChange}
          name="title"
          placeholder="Title"
          value={note.title}
        />
        <textarea
          name="message"
          placeholder="Write you memories..."
          onChange={HandleChange}
          value={note.message}
          rows="3"
        />
        <button onClick={sumbitnote}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
