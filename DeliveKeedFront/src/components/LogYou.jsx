import { useEffect, useState } from 'react';
import './LogYou.css';
import infoIcon from '../images/info.png';
import accountCircle from '../images/account_circle.png';

const LogYou = () => {
  const [userInfo, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userInfo');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="logYou">
      <img className='info' src={infoIcon} alt="Info Icon" />
      <div className="textLogYou">
        <p>Delive</p>
        <p>Keep</p>
      </div>
      <div className="userGreeting">
        <img  id="login" src={accountCircle} alt="Account Icon" onClick={handleLoginClick} className={!userInfo ? 'loggedIn' : ''} />
        {userInfo && <span>Olá, {userInfo}!</span>}
      </div>
    </div>
  );
};

export default LogYou;