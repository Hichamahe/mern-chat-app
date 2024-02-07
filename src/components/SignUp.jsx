import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import  image  from "../images/signup.svg"
import { BiHide, BiShow } from "react-icons/bi"
import { useState } from "react"
import axios from 'axios'
import { useSuccess } from "../SuccessProvider ";

function SignUp() {
  const [showpassword, setShowpassword] = useState(false)
  const [showconfpassword, setShowconfpassword] = useState(false)
  const [name, setName] = useState('')
  const [lastName, setlastName] = useState('')
  const [email, setEmail] = useState('');
  const [confirm_email, setConfirm_email] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [nameError, setNameError] = useState('');
  const [lastNameError, setlastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailconfError, setEmailconfError] = useState('');
  const [passwordError, setPasswordError] = useState('')
  const [passwordconfError, setPasswordconfError] = useState('');
  const [validEmail, setvalidEmail] = useState('')
  const [isRed, setIsRed] = useState(false)
  const [, setUsers] = useState([])
  const navigate  = useNavigate();
  const { setSuccessMessage } = useSuccess();

      const handleSubmit = async (event) => {
    event.preventDefault();

    if (name === '') {
    setNameError('entrer votre nom');
      setIsRed(!isRed)
    } else {
      setNameError('');
    }

        if (lastName === '') {
    setlastNameError('entrer votre Prénom');
      setIsRed(!isRed)
    } else {
      setlastNameError('');
    }

    if (email === '') {
    setEmailError('entrer votre email');
      setIsRed(!isRed)
    } else {
      setEmailError('');
    }
    
    if (email !== '' && !isValidEmail(email)) {
      setvalidEmail('entrer un email valide');
      setIsRed(!isRed)
    }else {
      setvalidEmail('');
    }

        if (confirm_email === '') {
    setEmailconfError('entrer votre email');
      setIsRed(!isRed)
    } else {
      setEmailconfError('');
    }

      if (email !== confirm_email) {
    setEmailconfError('Les adresses e-mail ne correspondent pas');
    setIsRed(!isRed);
  } else {
    setEmailconfError('');
  }

    if (password === '') {
      setPasswordError('entrer votre mot de passe');
      setIsRed(!isRed)
    } else {
      setPasswordError('');
    }

    if (confirm_password === '') {
      setPasswordconfError('entrer votre mot de passe');
      setIsRed(!isRed)
    } else {
      setPasswordconfError('');
    }

      if (password !== confirm_password) {
    setEmailconfError('Les mots de passe ne correspondent pas');
    setIsRed(!isRed);
  } else {
    setEmailconfError('');
    setIsRed(isRed);
  }

   if(name && lastName && email && password){
    const userData = { name, lastName, email, password };
    try {
     const res = await axios.post(`http://localhost:3003/create`, userData)
    // Ajouter le nouvel utilisateur à la liste existante
    setUsers(prevUsers => [...prevUsers, res.data]);
    // Réinitialiser les champs du formulaire après l'ajout de l'utilisateur
    setName("");
    setlastName("");
    setEmail("");
    setConfirm_email("");
    setPassword("");
    setConfirm_password("");
    setEmailError("");
    setPasswordError("");
    navigate(`/`);
    //envoyer un message de seccés
    setSuccessMessage('Votre compte a été créé avec succès!');
    //supprimer le message
    }catch (error) {
      // Si une erreur se produit lors de la création
      if (error.response) {
        if (error.response.data.errors) {
          const {email, password} = error.response.data.errors
          // Mettre à jour les messages d'erreur
          setEmailError(email);
          setPasswordError(password);
        } else {
        console.error("Erreur lors de l'envoi des données au serveur :", error);  
        }
      }
    }
  }
  }

  const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
  };

  const togglepassword = ()=>{
    setShowpassword(!showpassword)
  }
    const toggleconfpassword = ()=>{
    setShowconfpassword(!showconfpassword)
  }

  return (
    <div className='flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-y-[50%] sm:-translate-y-[46%] xs:-translate-y-[46%] -translate-x-1/2 w-full'>
    <div className='my-14 flex border border-1 rounded-md p-3 xs:flex-col-reverse sm:flex-col-reverse xs:mt-80 sm:mt-80'>
    <form action="" method="post" className="flex flex-1 flex-col space-y-4 w-full mx-2" onSubmit={handleSubmit}>
    <div className="">
      <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
      <input type="text" placeholder="Nom" className={`${isRed ? 'border-red-500' :''} border-solid border-[1px] rounded-md p-2 w-full`} onChange={(e) => setName(e.target.value.toLowerCase())}/>
      {nameError && <p className="text-red-500">{nameError}</p>}
    </div>
    <div className="">
      <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
      <input type="text" placeholder="prénom" className={`${isRed ? 'border-red-500' :''} border-solid border-[1px] rounded-md p-2 w-full`} onChange={(e) => setlastName(e.target.value.toLowerCase())}/>
      {lastNameError && <p className="text-red-500">{lastNameError}</p>}
    </div>
    <div className="">
      <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
      <input type="email" placeholder="Email" className={`${isRed ? 'border-red-500' :''} border-solid border-[1px] rounded-md p-2 w-full`} onChange={(e) => setEmail(e.target.value.toLowerCase())}/>
      {emailError && <p className="text-red-500">{emailError}</p>}
      {validEmail && <p className="text-red-500">{validEmail}</p>}
    </div>
    <div className="">
      <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
      <input type="email" placeholder="Confirmer votre email" className={`${isRed ? 'border-red-500' :''} border-solid border-[1px] rounded-md p-2 w-full`} onChange={(e) => setConfirm_email(e.target.value.toLowerCase())}/>
      {emailconfError && <p className="text-red-500">{emailconfError}</p>}
    </div>
    <div className="">  
      <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
      <input type={showpassword ? 'text' : 'password'} placeholder="password" className={`${isRed ? 'border-red-500' :''} border-solid border-[1px] rounded-md p-2 w-full`} onChange={(e) => setPassword(e.target.value.toLowerCase())}/>
      <span className="absolute transform translate-x-[-24px] translate-y-[10px]" onClick={togglepassword}>
      {showpassword ? <BiShow className=""/> : <BiHide className=""/>}
      </span>
      {passwordError && <p className="text-red-500">{passwordError}</p>}
    </div>
    <div className="">
      <span className='text-red-500 absolute transform translate-x-[-10px] translate-y-[10px]'>*</span>
      <input type={showconfpassword ? 'text' : 'password'} placeholder="Confirmer votre password" className={`${isRed ? 'border-red-500' :''} border-solid border-[1px] rounded-md p-2 w-full`} onChange={(e) => setConfirm_password(e.target.value.toLowerCase())}/>
      <span className="absolute transform translate-x-[-24px] translate-y-[10px]" onClick={toggleconfpassword}>
      {showconfpassword ? <BiShow className=""/> : <BiHide className=""/>}  
      </span>
      {passwordconfError && <p className="text-red-500">{passwordconfError}</p>}
    </div>
    <div className="flex justify-between">
      <Link to="/" className="underline text-primary">Se connecter</Link>
      <button className="bg-principale text-white w-fit py-2 px-4 rounded-md">S&apos;inscrire</button>
    </div>
    </form>

      <div className="flex-1">
        <img src={image} alt="" className="w-[500px] h-fit"/>
      </div>
    </div>
    </div>
  )
}


export default SignUp