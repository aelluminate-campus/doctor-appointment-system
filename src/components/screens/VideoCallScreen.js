import React, { useEffect, useRef, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const VideoCallScreen = ({ appointment, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [room] = useState(`room-${Math.random().toString(36).substr(2, 9)}`);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const userDetails = useSelector(state => state.userDetails);
  const { user } = userDetails;

  const listMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      console.log('Media devices:', devices);
  
      const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Video input devices:', videoInputDevices);
  
      setVideoDevices(videoInputDevices);
      
      if (videoInputDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
      }
  
      const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
      console.log('Audio input devices:', audioInputDevices);
  
    } catch (error) {
      console.error("Error listing media devices:", error);
    }
  };

  useEffect(() => {
    const initializeSocket = () => {
      socketRef.current = io.connect('http://localhost:5000');
      socketRef.current.emit('join', room);
    };

    const setupPeerConnection = (localStream) => {
      peerConnectionRef.current = new RTCPeerConnection();
      localStream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, localStream);
      });

      socketRef.current.on('offer', async (offer) => {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current.emit('answer', answer);
      });

      socketRef.current.on('answer', (answer) => {
        peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socketRef.current.on('iceCandidate', (candidate) => {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('iceCandidate', event.candidate);
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    };

    const getUserMedia = async () => {
      if (!selectedDeviceId) {
        console.error("No camera selected.");
        return;
      }

      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
          audio: true
        });
        
        console.log('Local stream:', localStream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        setupPeerConnection(localStream);

      } catch (error) {
        console.error("Error accessing media devices:", error);
        if (error.name === 'NotFoundError') {
          alert('No media devices found. Please connect a camera and microphone.');
        } else if (error.name === 'NotAllowedError') {
          alert('Permission denied. Please allow access to your camera and microphone.');
        } else {
          alert("An error occurred while accessing media devices. Please check your permissions.");
        }
      }
    };

    listMediaDevices();
    initializeSocket();
  
    if (selectedDeviceId) {
      getUserMedia(); 
    }
  
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        const stream = remoteVideoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      socketRef.current.disconnect();
    };
  }, [room, selectedDeviceId]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(prev => {
      const newVideoState = !prev;
      const localStream = localVideoRef.current.srcObject;
      if (localStream) {
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = newVideoState;
        });
      }
      return newVideoState;
    });
  };

  const handleEndCall = () => {
    onEndCall(); 
  };

  const handleJoinGoogleMeet = (meetUrl) => {
    if (meetUrl) {
      window.open(meetUrl, '_blank'); 
    } else {
      alert("No Google Meet link provided.");
    }
  };

  return (
    <Container className="mt-4 flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Device Selection */}
      <Row className="mb-4 w-full">
        <Col className="text-center">
          <select 
            onChange={(e) => setSelectedDeviceId(e.target.value)} 
            value={selectedDeviceId} 
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Camera</option>
            {videoDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      {/* Video Streams */}
      <Row className="mb-4 w-full">
        <Col className="text-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted={isMuted}
            className="w-full h-auto border border-gray-300 rounded-lg shadow-sm"
          />
          <h5 className="mt-2 font-semibold">{user.name === appointment.user_name ? "You" : appointment.user_name}</h5>
        </Col>
        <Col className="text-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-auto border border-gray-300 rounded-lg shadow-sm"
          />
          <h5 className="mt-2 font-semibold">Dr. {appointment.doctor_name}'s Video</h5>
        </Col>
      </Row>

      {/* Control Buttons */}
      <Row className="flex justify-center mb-4 w-full">
        <Col xs="auto">
          <Button
            variant={isMuted ? 'danger' : 'success'} 
            onClick={handleToggleMute}
            className={`px-4 py-2 rounded-md text-white ${isMuted ? 'bg-red-600' : 'bg-green-600'}`}
          >
            {isMuted ? (
              <i className="bi bi-mic-mute-fill"></i>
            ) : (
              <i className="bi bi-mic-fill"></i>
            )}
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant={isVideoOn ? 'success' : 'danger'} 
            onClick={handleToggleVideo}
            className={`px-4 py-2 rounded-md text-white ${isVideoOn ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {isVideoOn ? (
              <i className="bi bi-camera-video-fill"></i>
            ) : (
              <i className="bi bi-camera-video-off-fill"></i>
            )}
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={handleEndCall} className="px-4 py-2 rounded-md text-white bg-red-600">
            End Call
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleJoinGoogleMeet(appointment.google_meet_link)} className="px-4 py-2 rounded-md text-white bg-blue-600">
            Join Google Meet
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoCallScreen;
