import { useEffect, useState } from 'react';
import './LogYou.css';
import infoIcon from '../images/info.png';
import accountCircle from '../images/account_circle.png';
import hbMenu from '../images/hambMenu.svg';

const LogYou = () => {
  const [userInfo, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userInfo');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleInfoClick = () => {
    window.location.href = '/info';
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleEnderecoClick = () => {
    window.location.href = '/endereco';
  }

  const handlePaymentClick = () => {
    window.location.href = '/pagamento';
  }

  const handleProductClick = () => {
    window.location.href = '/produtos';
  }
  const handleAtendimentoClick = () => {
    window.location.href = '/atendimento';
  }

  const token = localStorage.getItem('authToken');

  const dropDownMenu = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.logYou')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="logYou">
      <img className='info' src={infoIcon} alt="Info Icon" onClick={handleInfoClick} style={{ display: token ? 'none' : 'block' }} />
      <img id='hbMenu' className='hbMenu' src={hbMenu} alt="Menu Icon" onClick={dropDownMenu} style={{ display: !token ? 'none' : 'block' }} />
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            marginLeft: "5rem",
            marginTop: "17rem",
            backgroundColor: "#1A273E",
            border: "1px solid #fff",
            borderRadius: "5px",
            listStyle: "none",
            padding: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            cursor: "pointer"
          }}
        >
          <li onClick={handleEnderecoClick} style={{ padding: "8px 12px", cursor: "pointer" }}>Meus Endereços</li>
          <li style={{ padding: "8px 12px", cursor: "pointer" }}>Meus Dados</li>
          <li onClick={handlePaymentClick} style={{ padding: "8px 12px", cursor: "pointer" }}>Carteira</li>
          <li onClick={handleProductClick} style={{ padding: "8px 12px", cursor: "pointer" }}>Meus Produtos</li>
          <li onClick={handleAtendimentoClick} style={{ padding: "8px 12px", cursor: "pointer" }}>Atendimentos</li>
        </ul>
      )}
      <div className="textLogYou" onClick={handleHomeClick}>
        <p>Delive</p>
        <p>Keep</p>
      </div>
      <div className="userGreeting">
        <img id="login" src={accountCircle} alt="Account Icon" onClick={handleLoginClick} className={!userInfo ? 'loggedIn' : ''} />
        {userInfo && <span>Olá, {userInfo}!</span>}
      </div>
    </div>
  );
};

export default LogYou;