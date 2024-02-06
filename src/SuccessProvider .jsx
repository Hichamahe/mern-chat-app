import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie'


const SuccessContext = createContext();
export const AuthContext = createContext(null);

export const SuccessProvider = ({ children }) => {
  const [success, setSuccess] = useState({ message: '', type:''});
  const [user, setUser] = useState(null);
  const [ , setCookies] = useCookies(["access-token"])
  const [errormsg, setErrormsg] = useState('');
  const [userId, setUserId] = useState(null);

  const setSuccessMessage = (message, type = 'success') => {
    setSuccess({ message, type });
    // Clear the message after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      setSuccess({ message: '', type: '' });
    }, 6000);
  };

  const setErrorMessage = (errorMessage) => {
    setErrormsg(errorMessage);
  };
  
    const login = async (userData) => {
      try{
      const { email, password } = userData;       
      const response = await axios.post('http://localhost:3003/login', {email,password});
      setCookies("access-token", response.data.token)
      window.localStorage.setItem("userID", response.data.id)
      setUser(userData);
      setUserId(response.data.id);  
      return response    
      }catch (error){
        // Gestion des erreurs
        if (error.response && error.response.status === 401) {
        // Affichez un message d'erreur à l'utilisateur
        setErrorMessage('Email ou mot de passe incorrect');
        } else {
          setErrorMessage('Erreur lors de la connexion');
          console.error('Erreur lors de la connexion :', error.message);
          }
        }
    };

    useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3003/home/users/${userId}`)
        .then(res => {
          setUser(res.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données :", error);
        });
    }
    }, [userId]);


  return (
    <SuccessContext.Provider value={{ success, setSuccessMessage, user, login, userId, errormsg  }}>
      {children}
    </SuccessContext.Provider>
  );
};

SuccessProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSuccess = () => {
  return useContext(SuccessContext);
};
