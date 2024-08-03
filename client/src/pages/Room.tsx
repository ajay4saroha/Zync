import React, { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
export default function Room() {
  // const [stream,setStream] = useState<any>(null);
  const socket = useRef<any>(null)
  const localStream = useRef<any>(null);
  const remoteStream = useRef<any>(null);
  const peerConnection = useRef<any>(null);
  const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
  const setPeerConnection = async (stream:any) => {
    peerConnection.current = new RTCPeerConnection(configuration);
    console.log(peerConnection.current.getLocalStreams());

    stream.getTracks().forEach((track:any)=>{
      peerConnection.current.addTrack(track,stream);
    })

    peerConnection.current.onicecandidate= (e:any) => {
      if(e.candidate){
        // peerConnection.current.
        socket.current.emit('icecandidate',{candidate:e.candidate});
      }
    }

    peerConnection.current.ontrack=(e:any)=>{
      console.log('Stream gett', e.streams);
      remoteStream.current.srcObject = e.streams[0];
    }
  }

  const handleIceCandidate= async (candidate:any) => {
    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  }


  const handleAnswer= async (answer:any) => {
    // console.log(answer);
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
    console.log("Remote : ",peerConnection.current.getRemoteStreams())
    remoteStream.current.srcObject = peerConnection.current.getRemoteStreams()[0]
    // const remoteStream = peerConnection.current.getRemoteStreams();
    // console.log(remoteStream)
    // remoteStream.current.srcObject= peerConnection.current.getRemoteStreams();
    console.log(peerConnection.current);
  }

  const handleOffer = async (offer:any) => {
    // console.log(offer.offer)
    offer = offer.offer;
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    console.log(peerConnection.current.getRemoteStreams())
    
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.current.emit('answer',{answer:peerConnection.current.localDescription});
    // console.log(peerConnection.current);
  }


  useEffect(()=>{
    socket.current = io('http://localhost:9000')

    socket.current.on('iceCandidate',(data:any)=>{
      console.log(data);
      handleIceCandidate(data.candidate);
    })

    socket.current.on('offerFrom',(data:any)=>{
      handleOffer(data.offer);
    })

    socket.current.on('answer',(data:any)=>{
      handleAnswer(data.answer)
    })
    return () => {
      socket.current.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  },[])


  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({
      video:{height:36,width:48},
      audio:false
    })
    .then(async stream=>{
      console.log("local :",stream);
      localStream.current.srcObject=stream;
      setPeerConnection(stream);
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.current.emit('newOffer',{offer:peerConnection.current.localDescription})
    })
    .catch(err=>{
      console.error(err);
    })
  },[])

  return (
    <div>
      <h1>Local Stream</h1>
      <video ref={localStream} autoPlay muted playsInline />
      <br />
      <h1>Remote Stream</h1>
      <video autoPlay playsInline ref={remoteStream}  />
    </div>
  )
}
