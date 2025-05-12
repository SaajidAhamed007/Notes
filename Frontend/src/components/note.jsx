import React from "react";

function Note(props) {
  function deleting() {
    props.deletenote(props.id);
  }


  return (
    <div className="note">
      <p>{props.date}</p>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
      <button onClick={deleting}>Delete</button>
    </div>
  );
}

export default Note;