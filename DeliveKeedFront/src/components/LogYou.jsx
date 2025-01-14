import './LogYou.css';
import infoIcon from '../images/info.png';
import accountCircle from '../images/account_circle.png';

const LogYou = () => {
  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="logYou">
      <img className="info" src={infoIcon} alt="Info Icon" />
      <div className="textLogYou">
        <p>Delive</p>
        <p>Keep</p>
      </div>
      <img className="info" id="login" src={accountCircle} alt="Account Icon" onClick={handleLoginClick} />
    </div>
  );
};

export default LogYou;
