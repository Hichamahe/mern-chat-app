import { FaUser } from "react-icons/fa";
import { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


function Profil() {
  const [user, setUser] = useState(null);
  const [cookies, setCookies] = useCookies(['access-token']);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null)
  const [Image, setImage] = useState('')
  const [showCompte , setShowCompte] = useState(false)
  

  useEffect(() => {
    const token = cookies['access-token'];
    const userId = localStorage.getItem('userID');

    if (token && userId) {
      axios.get(`http://localhost:3003/home/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => {
        setUser(res.data);
        if (res.data.image) {
          setImage(res.data.image);
        }
      })
      .catch(error => {
        console.error("Erreur:", error);
      });
    }
  }, [cookies]);

  const handleDeconnexion = async (userId) => {
    try {
      // Appeler la route de déconnexion côté serveur
      await axios.post('http://localhost:3003/logout', {userId});
      // Effectuer d'autres actions de déconnexion nécessaires (par exemple, vider le token JWT, rediriger l'utilisateur, etc.)
    setCookies('access-token','', { path: '/' });
    localStorage.removeItem('userID');
    navigate('/');
    setUser(null)
    setImage(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      // Gérer les erreurs de déconnexion
    }
  }


  const supprimerCompte = async (userId) => {
    await axios.delete('http://localhost:3003/home/delete', {
        data: { id: userId } // Envoyer l'ID dans le corps de la demande
    })
        .then(() => {
            // Filtrer la liste pour exclure l'utilisateur supprimé
            setUser(prevUser => Array.isArray(prevUser) ? prevUser.filter(user => user._id !== userId) : []);
            setCookies("access-token", "")
            window.localStorage.removeItem("userID")
            navigate('/SignUp')
            setUser(null)
            setImage(null)
        })
        .catch((error) => {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        });
};

   const toggleConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

   const dontConfirm = ()=>{
    setShowConfirmation(false)
  }
  const handleImageClick = ()=>{
    inputRef.current.click();
  }
const handleFileUpload = async () => {
  const file = inputRef.current.files[0];
  const userId = localStorage.getItem('userID');
  
  const formData = new FormData();
  formData.append('image', file); // file est votre fichier d'image
  formData.append('id', userId); // userId est l'ID de l'utilisateur


  try {
    const response = await axios.post('http://localhost:3003/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.image) {
      setImage(response.data.image);
    } else {
      console.error('La propriété image n\'existe pas dans la réponse du serveur.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du fichier:', error);
  }
};

const toggleShowCompte = ()=>{
  setShowCompte(!showCompte)
}
   

  return (
    <section className=" flex p-2 relative flex-1 justify-center">
      {
        user  ? (
          <>
          <div className='flex space-x-1'>
          {
            !Image ?
          (<FaUser className='text-gray-300 bg-gray-700 rounded-full w-[30px] h-[30px] cursor-pointer' onClick={toggleShowCompte}/>)
          :
          (<img src={`http://localhost:3003/getimage/${Image}`} alt={`http://localhost:3003/getimage/${Image}`} className='rounded-full w-9 h-9 cursor-pointer' onClick={toggleShowCompte}/>)
          }
          {
            showCompte ? (
            <div className='absolute transform translate-y-[52px] -translate-x-40 xxs:-translate-x-[124px] shadow-lg rounded-sm z-20 p-2 bg-white w-max'>
              <div className='flex pt-1 space-x-1 justify-center'>
                <p className='text-lg xxs:text-sm'>{user.name}</p>
                <p className='text-lg xxs:text-sm'>{user.lastName}</p>
              </div>

              <div className='flex flex-col items-center'>
                <button className='underline p-1 xxs:text-sm' onClick={()=> handleDeconnexion(user._id)}>Deconnexion</button>
                <button className='underline p-1 xxs:text-sm' onClick={toggleConfirmation}>Supprimer Mon compte</button>
              </div>

              <div className='flex justify-center' onClick={handleImageClick}>
                <button className='underline p-1 xxs:text-sm'>Importez Votre Photo</button>
                <input type='file' className='hidden' name='image' accept='image/*' ref={inputRef} onChange={handleFileUpload} /> 
              </div>
            </div>
              )  : (
              ''
              )
          }
          </div>
          {
           showConfirmation ?
             <div className={`flex flex-col items-center justify-center space-y-3 rounded absolute transform translate-y-[100px] -translate-x-[50%] bg-white p-3 -shadow-tw-shadow-colored z-30 w-max xs:w-[300px]`}>
             <div className=''>
             <h1 className='text-red-500 text-center xs:text-xs xxs:text-xs'>Voulez-vous vraiment supprimer votre compte </h1>
             </div>  
             <div className='flex justify-around items-center w-full space-x-2'>
              <button className='flex-1 bg-red-500 text-white p-2 rounded  justify-center' onClick={() => supprimerCompte(user._id)}>oui</button>
              <button className='flex-1 bg-blue-500 text-white p-2 rounded  justify-center' onClick={dontConfirm} >non</button>
             </div>
             </div>
            : 
             ''
        } 
        </>
        ) : (
          ''
        )
      }      
    </section>
  );
}


export default Profil