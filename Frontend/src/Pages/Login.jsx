import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({setAuth}) => {

    const [credentials,setCredentials]=useState({
        username:"",
        password:""
    })
    const navigate=useNavigate();

    const handleChange = (event) => {
        const {name,value}=event.target;
        setCredentials(prev => ({...prev,[name]:value}));
    }

    const HandleSubmit = (e)=>{
        e.preventDefault();

        fetch("http://localhost:3000/api/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(credentials)
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.token){
                localStorage.setItem("token",data.token)
                setAuth(true);
                navigate('/notes')
            }
        })
    }

    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={HandleSubmit}>
            <input name='username' placeholder='username' onChange={handleChange}></input>
            <input name='password' placeholder='password' onChange={handleChange}></input>
            <button type='submit'>submit</button>
        </form>
        </div>
    )
}

export default Login
