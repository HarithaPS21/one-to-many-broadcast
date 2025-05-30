import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function BroadCaster() {
  const [peerId, setPeerId] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const callsRef = useRef([]);

  useEffect(() => {
    const newPeer = new Peer();
    peerRef.current = newPeer;
    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    newPeer.on("call", (call) => {
      // Only answer if broadcasting and stream is ready
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
        callsRef.current.push(call);
        call.on("close", () => {
          callsRef.current = callsRef.current.filter((c) => c !== call);
        });
      } else {
        call.close();
      }
    });

    return () => {
      newPeer.destroy();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCopy = () => {
    if (peerId) {
      navigator.clipboard.writeText(peerId);
    }
  };

  const handleStartBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsBroadcasting(true);
    } catch (err) {
      alert("Could not access camera/microphone.");
    }
  };

  const handleHangup = () => {
    setIsBroadcasting(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    callsRef.current.forEach((call) => call.close());
    callsRef.current = [];
  };

  return (
    <>
      <h2>Broadcaster</h2>
      <div>
        <button onClick={handleStartBroadcast} disabled={isBroadcasting}>
          Start Broadcast
        </button>
        <button
          onClick={handleHangup}
          disabled={!isBroadcasting}
          className="hangup"
        >
          Hang Up
        </button>
      </div>
      <video ref={localVideoRef} autoPlay playsInline />
      <p>Your Peer ID:</p>
      <div>
        <textarea
          name="peer-id"
          id="peer-id"
          rows={2}
          cols={40}
          value={peerId}
          readOnly
        />
        <br />
        <button onClick={handleCopy}>Copy</button>
      </div>
    </>
  );
}

// No changes needed; the broadcaster only sends its stream to viewers.

export default BroadCaster;
