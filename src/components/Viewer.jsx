import { useRef, useState, useEffect } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";

function Viewer() {
  const [broadcasterId, setBroadcasterId] = useState("");
  const [connected, setConnected] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const callRef = useRef(null);

  const createDummyStream = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1, 1);
    const videoStream = canvas.captureStream();
    const videoTrack = videoStream.getVideoTracks()[0];

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const dst = oscillator.connect(audioCtx.createMediaStreamDestination());
    oscillator.start();
    const audioTrack = dst.stream.getAudioTracks()[0];

    return new MediaStream([videoTrack, audioTrack]);
  };

  const handleConnect = () => {
    const peer = new Peer();
    peerRef.current = peer;
    if (!peer || !broadcasterId) return;

    peer.on("open", () => {
      const dummyStream= createDummyStream();
      const call = peer.call(broadcasterId, dummyStream);
      callRef.current = call;
      if (call) {
        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
          toast.success("Connected to broadcaster!");
          setConnected(true);
        });
        call.on("close", () => {
          setConnected(false);
          setRemoteStream(null);
          toast.info("Connection closed.");
        });
        call.on("error", () => {
          setConnected(false);
          setRemoteStream(null);
          toast.error("Stream error.");
        });
      } else {
        toast.error("Could not connect. The broadcaster may not be streaming yet or the Peer ID is incorrect.");
        setConnected(false);
      }
    });

    peer.on("error", (err) => {
      toast.error("PeerJS error: " + err);
      setConnected(false);
    });
  };

  const handleHangup = () => {
    setConnected(false);
    setRemoteStream(null);
    setBroadcasterId(""); // Reset the textarea
    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    toast.info("Disconnected.");
  };

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (remoteVideoRef.current && !remoteStream) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStream]);

  return (
    <>
      <h2>Viewer</h2>
      {/* Connection status */}
      <div style={{ margin: "8px 0", fontWeight: "bold" }}>
        Status:{" "}
        {connected
          ? "Connected"
          : remoteStream
          ? "Receiving stream..."
          : "Not connected"}
      </div>
      <textarea
        name="broadcaster-peer-id"
        id="broadcaster-peer-id"
        rows={2}
        cols={40}
        placeholder="Paste Broadcaster's Peer ID here..."
        value={broadcasterId}
        onChange={(event) => setBroadcasterId(event.target.value)}
        disabled={connected}
      />
      <br />
      <button onClick={handleConnect} disabled={connected || !broadcasterId}>
        Connect
      </button>
      <button
        onClick={handleHangup}
        disabled={!connected}
        className="hangup"
      >
        Hang Up
      </button>
      <h3>Remote Streams</h3>
      <div className="video-grid">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline />
        ) : (
          <div>No remote streams found.</div>
        )}
      </div>
    </>
  );
}

export default Viewer;
