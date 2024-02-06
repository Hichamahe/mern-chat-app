import { useEffect, useState, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import axios from "axios";
import { useCookies } from 'react-cookie';

function Users({ onUserClick, selectedUser = null}) {
  const [cookies] = useCookies(['access-token']);
  const [Users, setUsers] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [notifications, setNotifications] = useState({});
  const controls = useAnimation();
  const carouselRef = useRef();
  
    useEffect(() => { 
      const socket = io('http://localhost:3003', {
        transports: ['websocket'],
      }); 
      const userId = localStorage.getItem('userID');
      // Mettez à jour le statut de l'utilisateur lors de la connexion
      socket.emit('updateUserStatus', userId, true);
      // Écoute des utilisateurs actifs
      socket.on('activeUsers', (updatedActiveUsers) => {
      setActiveUsers(updatedActiveUsers);
      });
  
        socket.on('messageNotification', (data) => {
          // Mettre à jour l'état des notifications
          const key = `${data.senderId}_${data.receiverId}`;
          setNotifications((prevNotifications) => ({ ...prevNotifications, [key]: (prevNotifications[key] || 0) + 1 }));
          if (selectedUser.userId === data.senderId) {
            setNotifications({})
          }
        });  

      return () => {
       socket.off('activeUsers');
       socket.off('messageNotification');
      };
    }, [Users._id, selectedUser])
  
useEffect(() => {
  let isMounted = true; // flag pour détecter si le composant est toujours monté
  const token = cookies['access-token'];
  if (token) {
    axios.get(`http://localhost:3003/allUsers`, {
      headers: {
        'Authorization': token,
      },
    })
    .then(res => {
      if (isMounted) {
        setUsers(res.data);
        controls.start({ opacity: 1, x: 0 });
      }
    })
    .catch(error => {
      console.error("Erreur:", error);
    });
  }
  // Fonction de nettoyage
  return () => {
    isMounted = false;
  };
}, [cookies, controls]); // dépendance à cookies
    
    const handleUserClick = (user) => {
    // Créez un tableau avec les données de l'utilisateur et appelez la fonction de rappel
    const userData = {
      userId: user._id,
      userName: user.name,
      userLastName: user.lastName,
      userImage: user.image,
    };
      onUserClick(userData);

      const notificationKey = `${user._id}_${localStorage.getItem('userID')}`;
      setNotifications(prevNotifications => { const updatedNotifications = { ...prevNotifications };
      delete updatedNotifications[notificationKey];
      return updatedNotifications;
  });
  };
  
  // limiter le nom d'utilisateur à 10 lettres
  const truncateUsername = (username) => {
    return username.length > 6 ? username.slice(0, 6) + "..." : username;
  };

  return (
      <div className="flex-1 space-y-2 flex flex-col items-center overflow-hidden w-full">
        <div className="w-fit">
          <h1 className="font-bold">Liste des utilisateurs</h1>
        </div>
        <div className="flex w-full space-x-2 overflow-x-auto justify-center xxs:justify-normal" ref={carouselRef}>
          {Users.map((user => {
            const notificationKey = `${user._id}_${localStorage.getItem('userID')}`;
            const userNotifications = notifications[notificationKey] || 0;
            return (
            <motion.div
            key={user._id}
            dragConstraints={{right: 0, left: -carouselRef.current.offsetWidth}}
            > 
                <ul  className="flex-col cursor-pointer" onClick={() => handleUserClick(user)}>
                  {
                    !user.image ? (
                      <li className="flex items-center justify-center relative">
                        <FaUser className="text-gray-300 bg-gray-700 rounded-full w-[40px] h-[40px] -z-50" />
                        {
                         activeUsers.some(activeUser => activeUser._id === user._id) ? 
                         (<span className="bg-green-500 w-3 h-3 rounded-full absolute transform translate-y-3 translate-x-4 z-10 border-2 border-white"/>)
                         :
                         ("")
                        }
                        {userNotifications > 0 && <span className="absolute bg-red-500 text-white rounded-full px-1 text-xs h z-10 transform -translate-x-[15px] -translate-y-[10px]">{userNotifications}</span>}
                      </li>
                    ) : (
                      <li className="flex items-center justify-center relative">
                        <img src={`http://localhost:3003/getimage/${user.image}`} alt={`Profile de ${user.name}`} className="rounded-full w-[40px] h-[40px] -z-50" />
                        {
                         activeUsers.some(activeUser => activeUser._id === user._id) ? 
                         (<span className="bg-green-500 w-3 h-3 rounded-full absolute transform translate-y-3 translate-x-4 z-10 border-2 border-white"/>)
                         :
                         ("")
                          }
                        {userNotifications > 0 && <span className="absolute bg-red-500 text-white rounded-full px-1 text-xs h z-10 transform -translate-x-[15px] -translate-y-[10px]">{userNotifications}</span>}  
                      </li>
                    )
                  }
                  <li className={`flex justify-start ${userNotifications > 0 ? 'font-bold' : ''}`}>{truncateUsername(user.name)}</li>
                   {/* <li className="">
                     
                   </li> */}
                </ul>
              </motion.div>  
            )
          })) 
        }       
        </div>      
      </div>
  )
}

Users.propTypes = {
  onUserClick: PropTypes.func.isRequired, 
  selectedUser: PropTypes.object
};

export default Users