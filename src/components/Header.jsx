import Profil from "./Profil";


function Header() {

   

  return (
    <header className="bg-principale flex justify-between items-center px-2 relative shadow-lg">
      <div className=''>
        <h1 className="text-white font-bold text-lg py-2">WackChat</h1>
      </div> 
      <div className="">
        <Profil />
      </div>
    </header>
  );
}

export default Header;

