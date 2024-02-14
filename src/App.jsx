import Header from './components/header'
import SignIn from './components/SignIn'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import { BrowserRouter } from 'react-router-dom';
import { SuccessProvider } from './SuccessProvider ';
import Chats from './components/connection/Chats'


function App() {

  return (
    <SuccessProvider>
    <BrowserRouter>
    <Header />
    <Routes>  
      <Route path='/' element={<SignIn />} />
      <Route path='/SignUp' element={<SignUp />}/>
      <Route path='/home/:userId' element={<Chats />}/>
    </Routes>
    </BrowserRouter>
    </SuccessProvider>



  )
}

export default App
