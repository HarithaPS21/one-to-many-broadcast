# One-To-Many Video Conference App

A simple one-to-many video conferencing application built with React, Vite, and PeerJS. This app allows a single broadcaster to stream their video and audio to multiple viewers in real-time using peer-to-peer WebRTC connections.

## Features

- **Broadcaster mode:** Share your camera and microphone stream with viewers.
- **Viewer mode:** Connect to a broadcaster using their Peer ID and watch the live stream.
- **Copy Peer ID:** Easily copy your Peer ID to share with viewers.
- **Real-time notifications:** User-friendly feedback with [react-toastify](https://fkhadra.github.io/react-toastify/introduction/).
- **Responsive UI:** Clean and simple interface for both broadcaster and viewers.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   # Using HTTPS
   git clone https://github.com/HarithaPS21/one-to-many-broadcast.git

   # Or using SSH
   git clone git@github.com:HarithaPS21/one-to-many-broadcast.git
   cd one-to-many-broadcast
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Broadcaster:**  
   - Click "I'm the Broadcaster".
   - Allow camera and microphone access.
   - Copy your Peer ID and share it with viewers.

2. **Viewer:**  
   - Click "I'm the Viewer".
   - Paste the broadcaster's Peer ID.
   - Click "Connect" to view the live stream.

## Project Structure

- `src/components/BroadCaster.jsx` — Broadcaster logic and UI
- `src/components/Viewer.jsx` — Viewer logic and UI
- `src/App.jsx` — Main app logic and mode selection
- `src/main.jsx` — React entry point

## Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [PeerJS](https://peerjs.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction/)
