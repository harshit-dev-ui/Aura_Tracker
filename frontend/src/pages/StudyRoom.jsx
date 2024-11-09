import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa'; // Import the icon

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const StudyRoom = () => {
  const { roomId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [timer, setTimer] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const userId = user._id;
  const userName = user?.username || user?.user?.username || "Anonymous";
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    socket.emit('joinRoom', { roomId, userId, userName });

    socket.on('userJoined', (newParticipant) => {
      setParticipants((prevParticipants) => {
        if (newParticipant && !prevParticipants.some(p => p.userId === newParticipant.userId)) {
          return [...prevParticipants, newParticipant];
        }
        return prevParticipants;
      });
    });

    socket.on('updateParticipants', (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    socket.on('timerStarted', (startTime) => {
      setTimer(startTime);
      setIsTimerRunning(true);
    });

    socket.on('timerUpdate', (newTimer) => {
      setTimer(newTimer);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveRoom', { roomId, userId });
      socket.off('userJoined');
      socket.off('updateParticipants');
      socket.off('timerStarted');
      socket.off('timerUpdate');
      socket.off("receiveMessage");
    };
  }, [roomId, userId, userName]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit("sendMessage", { roomId, message: inputMessage, userId, userName });
      setInputMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      socket.emit('startTimer', roomId, 1500);
    }
  };

  const stopTimer = () => {
    socket.emit('stopTimer', roomId);
    setIsTimerRunning(false);
    setTimer(0);
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', { roomId, userId });
    navigate('/rooms');
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => console.log('Room ID copied to clipboard!'))
      .catch((err) => console.error('Failed to copy room ID:', err));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-6xl bg-white p-10 rounded-lg shadow-2xl flex space-x-10 relative">
        
        {/* Left: Timer and Room Info */}
        <div className="w-1/3 border-r pr-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Room</h1>
          
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-700 mb-2">Participants : {participants.length}</p>
            <ul className="space-y-2">
              {participants.map((p) => (
                <li key={p.userId} className="text-gray-600">{p.userName}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-7xl font-semibold text-gray-700 mt-20 mb-10 text-center">
            {formatTime(timer)}
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {isTimerRunning ? (
              <button
                onClick={stopTimer}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Stop Timer
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Start Timer
              </button>
            )}
          </div>

          <button
            onClick={copyRoomId}
            className="mt-10 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Copy Room ID
          </button>
        </div>

        {/* Right: Chat Box */}
        <div className="w-2/3 relative">
          {/* Leave Room Button inside chat */}
          <button
            onClick={handleLeaveRoom}
            className="absolute right-4 bg-transparent text-red-600 font-bold text-xl hover:text-red-800"
          >
            Exit
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chat</h2>
          <div className="chat-container flex flex-col bg-gray-100 rounded-lg shadow-inner p-4 h-[500px]">
            
            <div className="messages-list overflow-y-auto flex-grow mb-4 p-2 bg-white rounded-lg max-h-[400px]">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 mb-3 rounded-lg shadow-sm ${
                    msg.userId === userId ? 'bg-blue-200 text-right ml-auto' : 'bg-gray-300 mr-auto'
                  }`}
                  style={{ maxWidth: '75%' }}
                >
                  <strong className="block text-blue-700">{msg.userName}</strong>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Trigger message send on Enter
                placeholder="Type your message..."
                className="border rounded-l-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white rounded-r-lg px-5 hover:bg-blue-600 transition"
              >
                <FaPaperPlane size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
