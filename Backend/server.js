import express from "express"
import bodyParser from "body-parser"
import mysql from "mysql2"
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET

const app=express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db=mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

db.connect(err =>{
    if (err) throw err;
    console.log("my sql connected")
})

function getCurrentTimestamp() {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // dd/mm/yyyy
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return `${date} ${time}`;
  }


function authenticateToken(req,res,next){
  const authHeader=req.headers["authorization"];
  const token=authHeader && authHeader.split(" ")[1];
  if(!token)res.sendStatus(401);

  jwt.verify(token,JWT_SECRET,(err,user)=>{
    if(err){
      res.sendStatus(403)
    }
    req.user=user;
    next();
  })
}
app.post("/api/register",async(req,res)=>{
  const {username,password}=req.body;
  const id=uuidv4();
  const hashedPassword=await bcrypt.hash(password,10);

  db.query("insert into users(id,username,password) values (?,?,?)",[id,username,hashedPassword],(err,result)=>{
    if(err){
      if(err.code=="ER_DUP_ENTRY"){
        return res.status(409).json({error:"user already exist"});
      }
      return res.status(500).json({error:"registration failed"});
    }
    return res.status(201).json({message:"user registered successfully"});
  })
})

app.post("/api/login",async(req,res)=>{
  const {username,password}=req.body;
   db.query("select * from users where username=?",[username],async(err,result)=>{
    if(err){
      return res.status(500).json({error:"database error"})
    }
    if(result.length==0){
      return res.status(401).json({error:"invalid username"});
    }
    const user=result[0];
    const match=await bcrypt.compare(password,user.password)
    if(!match){
      return res.status(401).json({error:"incorrect password"});
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    console.log(token)
    return res.status(200).json({token});

   })
})
app.get("/api/notes",authenticateToken,(req,res)=>{
    const userID=req.user.userId;
    db.query("select * from memories where user_id=?",[userID],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).json({error:"database error"})
        }else{
            res.json(results)
            console.log(results)
        }
    });
});

app.post("/api/notes",authenticateToken,(req,res)=>{
   const title=req.body.title;
   const message=req.body.message;
   const userId=req.user.userId;
   const id=uuidv4();
   const timestamp = getCurrentTimestamp();

   db.query("insert into memories(id,title,message,timestamp,user_id) values(?,?,?,?,?)",[id,title,message,timestamp,userId],(err,result)=>{
    if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
  
      res.status(201).json({
        id:id,
        message: message,
        title:title,
        timestamp:timestamp
      })
  })
})

app.put("/api/notes/:id",(req,res)=>{
  const id=req.params.id;
  const {title,message}=req.body;
  const timestamp=getCurrentTimestamp();

  db.query("select * from memories where id=?",[id],(err,result)=>{
    if(err||result.length==0){
      return res.status(404).json({error:"error in updating"});
    }

    const currentNote=result[0];

      const currentTitle=title||currentNote.title;
      const currentMessage=message||currentNote.message;

    db.query("update memories set title=?,message=?,timestamp=? where id=?",[currentTitle,currentMessage,timestamp,id],(err,result)=>{
      if(err){
       return res.status(500).json({error:"database update failed"});
      }
  
      if(result.affectedRows==0){
        return res.status(404).json({error:"note not found"});
      }
  
      res.json({ message: "Note updated successfully", note: { id, title, message, timestamp } });
  
    })
  })
  })

  

app.delete("/api/notes/:id",(req,res)=>{
  const id=req.params.id;
  
  db.query("delete from memories where id=?",[id],(err,result)=>{
    if(err){
     return res.status(500).json({error:"deletion failed"});
    }

    if(result.affectedRows==0){
     return res.status(404).json({error:"Note not found"});
    }

    res.json({message:"note deleted successfully"})
  })
})

app.listen(3000,()=>{
    console.log("server is running")
})