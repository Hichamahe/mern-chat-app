import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { format } from 'date-fns';
import io from 'socket.io-client';
import Users from "./Users";
const socket = io('http://localhost:3003'); 
function Chats() {
  const [selectedUser, setselectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeUsers, setActiveUsers] = useState([])
  const carouselRef = useRef();

  useEffect(() => {
    const userId = localStorage.getItem('userID')
    const fetchMessages = async () => {
      try {
        if (selectedUser) {
          const response = await axios.get(`http://localhost:3003/messages/${selectedUser.userId}/${userId}`);
          const messagesData = response.data;
          setMessages(messagesData);
        }  
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    const socket = io('http://localhost:3003', {
      transports: ['websocket'],
    });
    let userId = localStorage.getItem('userID');
    // Écoute des nouveaux messages
    socket.on('newMessage', (msg) => {
      if (selectedUser && msg.senderId !== userId && msg.receiverId === selectedUser.userId) {
        setMessages(prevMessages => [...prevMessages, msg]);
      } 
    });
    // Mettez à jour le statut de l'utilisateur lors de la connexion
    socket.emit('updateUserStatus', userId, true);
      // Écoute des utilisateurs actifs
      socket.on('activeUsers', (updatedActiveUsers) => {
      setActiveUsers(updatedActiveUsers);
      });
    // Gestion de la déconnexion
    return () => {
      socket.disconnect();
    };
  }, [selectedUser]);

  const sendMessage = async (ReceiverId) => {
    const senderId = localStorage.getItem('userID');
    if (!senderId || messageInput.trim() === '') return;
    try {
      const response = await axios.get(`http://localhost:3003/home/users/${senderId}`);
      const sender = response.data;
      const currentDate = new Date();
      if (isNaN(currentDate.getTime())) {
    console.error('Invalid current date format');
    return;
  }
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const formattedTime = format(currentDate, 'HH:mm');
    const messageData = {
      senderId: senderId,
      receiverId: ReceiverId,
      senderName: sender.name,
      senderLastName: sender.lastName,
      senderImage: sender.image,
      content: messageInput,
      sentAt: `${formattedDate} ${formattedTime}`,
    };

    socket.emit('sendMessage', messageData);

    // Déplacer l'appel setMessages([]) en dehors de la promesse
    setMessages((prevMessages) => [...prevMessages, messageData]);

    setMessageInput('');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
  }
};

  const handleUserClick = (userData) => {
    setselectedUser(userData);
  }; 
  return (
    <div className="flex flex-col p-2 items-center">      
      <Users onUserClick={handleUserClick} selectedUser={selectedUser}/>
      <div className="flex flex-col p-1 space-y-2 w-[60%] sm:w-[90%] xs:w-full xxs:w-full border rounded-md h-[70vh]">            
        <div className="w-full border-b">
          {
            selectedUser ? (
              <div className=" flex flex-col items-center justify-center">
                {
                  !selectedUser.userImage ?
                    (<FaUser className="text-gray-300 bg-gray-700 rounded-full w-[30px] h-[30px] -z-50 cursor-pointer" />)
                    :
                    (<img
                      src={`http://localhost:3003/getimage/${selectedUser.userImage}`}
                      alt={`Profile de ${selectedUser.userLastName}`}
                      className="rounded-full w-[30px] h-[30px] -z-50" />)
                }
                {
                  activeUsers.some(activeUser => activeUser._id === selectedUser.userId) ? 
                  (<span className="bg-green-500 w-3 h-3 rounded-full absolute transform -translate-y-[3px] translate-x-[13px] z-20 border-2 border-white"/>)
                  :
                  null
                  }
                <p>{selectedUser.userName} {selectedUser.userLastName}</p>
              </div>
            )
            :
            (
              <p className="flex items-center justify-center h-full text-center">Choisissez l&apos;utilisateur à qui vous souhaitez contacter</p>
            )
          }
        </div>

        <div className="overflow-y-scroll bg-gray-100 flex flex-col h-[50vh]" ref={carouselRef}>
            {
            selectedUser && (
            messages.map((message, index) => {
              return (
                <div key={index} className={`flex flex-col m-2 ${message.senderId === selectedUser.userId ? 'items-start' : 'items-end'}`}>
                  <div className="flex">
                    <div className="flex justify-center items-center">
                      {
                        !message.senderImage ? (
                          <FaUser className="text-gray-300 bg-gray-700 rounded-full w-[30px] h-[30px]" />
                        )
                          :
                          (
                            <img src={`http://localhost:3003/getimage/${message.senderImage}`} alt={`Profile de ${message.senderName}`} className="rounded-full w-[30px] h-[30px]" />
                          )
                      }
                    </div>
                    <div className={`bg-principale text-white p-1 rounded-sm ${message.senderId === selectedUser.userId ? 'rounded-tr-none order-last ml-2' : 'rounded-tl-none order-first mr-2'}`}>
                      {message.content}
                    </div>
                  </div>
                  <div className="">{format(new Date(message.sentAt), 'HH:mm')}</div>
                </div>
              );
            })
            )
          }
        </div>
        
        <div className="w-full flex items-end space-x-1 xs:flex-col xxs:flex-col xxs:items-center xxs:space-y-1 xs:items-center xs:space-y-1">
          <input type="text" className="py-2 rounded-md w-[75%] xxs:w-full border border-purple-300" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}/>
          <button
            className={`bg-principale text-white rounded-md px-4 py-2 w-[25%] xs:w-[50%] xxs:w-full ${
            selectedUser ? '' : 'cursor-not-allowed opacity-50'
            }`}
            onClick={() => selectedUser && sendMessage(selectedUser.userId)}
          >
            Envoyer
          </button>
        </div>

      </div>

    </div>
  )
}

export default Chats