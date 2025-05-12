import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUp = () => {

    const [credentials,setCredentials]=useState({
        username:"",
        password:"",
        confirmPassword:""
    })
    const navigate=useNavigate();

    const handleChange = (event) => {
        const {name,value}=event.target;
        setCredentials(prev => ({...prev,[name]:value}));
    }

    const HandleSubmit = (e)=>{
        e.preventDefault();

        if(credentials.password==credentials.confirmPassword){
            fetch("http://localhost:3000/api/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(credentials)
        })
        .then(res=>res.json())
        .then(()=>{
            navigate('/login')
        })
        }else{
            alert("type password correctly");
        }
        
    }

  return (
    <div>
      <h2>Register</h2>
        <form onSubmit={HandleSubmit}>
            <input name='username' placeholder='username' onChange={handleChange}></input>
            <input name='password' placeholder='password' onChange={handleChange}></input>
            <input name='confirmPassword' placeholder='confirm-password' onChange={handleChange}></input>
            <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default SignUp
