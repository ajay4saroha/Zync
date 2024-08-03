import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
export default function Home() {
  const [email,setEmail] = useState<string>("");
  const [roomId,setRoomId] = useState<string>("");
  const navigate = useNavigate();
  const handleJoin = () =>{
    navigate(`/room/${roomId}`);
  }
  return (
    <div>
      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email'/>
      <input type="text" value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder='Enter room id'/>
      <button onClick={handleJoin}>
        Join
      </button>
    </div>
  )
}
