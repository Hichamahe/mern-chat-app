import image from '../images/signin.svg'
import { Link, useNavigate} from 'react-router-dom'
import { BiHide, BiShow } from "react-icons/bi"
import { useState } from 'react'
// import axios from 'axios'
// import { useCookies } from 'react-cookie'
import { useSuccess, } from '../SuccessProvider '
import io from 'socket.io-client';

function SignIn() {
  const [showpassword, setShowpassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('')
  const [validEmail, setvalidEmail] = useState('')
  const [isRed, setIsRed] = useState(false)
  const navigate = useNavigate()

  const { success, login, errormsg } = useSuccess();

    const handleSubmit = async  (event) => {
    event.preventDefault();

    if (email === '') {
      setEmailError('entrer ton Email');
      setIsRed(!isRed)
    } else {
      setEmailError('');
      setIsRed(isRed)
    }
    
    if (!isValidEmail(email)) {
      setvalidEmail('entrer un Email Valid');
      setIsRed(!isRed)
    }else {
      setvalidEmail('');
      setIsRed(isRed)
    }

    if (password === '') {
      setPasswordError('entrer ton mot de passe');
      setIsRed(!isRed)
    } else {
      setPasswordError('');
      setIsRed(isRed)
    }

    // Si les champs sont valides, effectuer la requête vers le serveur
    if (email !== '' && password !== '') {
      try{
      const userData = { email, password }; // Créer un objet userData avec email et password
      const response = await login(userData);
       if (response && response.data && response.data.id) {
        const userId = response.data.id;
         navigate(`/Home/${userId}`);
         // Émettre l'événement côté client après la connexion
          const socket = io('http://localhost:3003', {
            transports: ['websocket'],
          });
          socket.emit('updateUserStatus', userId, true);
      } else {
        // Gérer le cas où 'data' ou 'data.id' est indéfini
        console.error('La réponse ne contient pas la propriété attendue :', response);
        // Gérer l'erreur ou rediriger vers une page d'erreur
      }
      }catch (error){
          console.error('Erreur lors de la connexion :', error.message);
          }
      }
  };
  
  const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
  };

  const togglepassword = ()=>{
    setShowpassword(!showpassword)
  }

  return (
    <div className='flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-y-[43%] -translate-x-1/2 w-full'>
    <div className='flex border border-1 rounded-md p-3 xs:flex-col sm:flex-col'>
      <div className='flex-1'>
        <img src={image} alt='signin' className='w-[500px] h-[300px] '/>
      </div>
      <div className='flex-1 flex justify-center items-center'>
        <form className='flex flex-col space-y-4 w-full mx-2' onSubmit={handleSubmit}>
            <div className={`message ${success.type === 'success' ? 'text-green-500' : ''}`}>
             {success.message}
            </div>
        {errormsg && <p className='text-red-500'>{errormsg}</p>}
          <div className='relative'>
          <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
          <input type='email' name='email' placeholder='name@exemple.com' value={email} onChange={(e) => setEmail(e.target.value)} className={`${isRed ? 'border-red-500' : ''} border-solid border-[1px] rounded-md p-2 w-full`}/>
          {emailError && <p className='text-red-500'>{emailError}</p>}
          {validEmail && <p className='text-red-500'>{validEmail}</p>}
          </div>
          <div className='relative'>
          <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
          <input type={showpassword ? 'text' : 'password'} name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} className={`${isRed ? 'border-red-500' : ''} border-solid border-[1px] rounded-md p-2 w-full relative`} />
          <span className='absolute transform translate-x-[-24px] translate-y-[10px]' onClick={togglepassword}>
          {showpassword ?
           <BiShow className='text-gray-400'/>
          :
          <BiHide className='text-gray-400'/>
          }
          </span>
          {passwordError && <p className='text-red-500'>{passwordError}</p>}
          </div>
          <div className='flex justify-between'>
          <Link to='/SignUp' className='underline text-primary'>s&apos;inscrir</Link>
          <button className='bg-principale text-white w-fit py-2 px-4 rounded-md'>Connexion</button>
          </div>
        </form> 
      </div>
    </div>
    </div>
  )
}

export default SignIn