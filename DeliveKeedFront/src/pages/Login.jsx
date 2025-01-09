import './Login.css';
import Header from '../components/Header';
import BackGround from '../components/BackGround';
import { Helmet } from 'react-helmet';

const Login = () => {
  const handleRegisterClick = () => {
    window.location.href = '/register';
  };

  return (
    <>
        <Helmet>
            <title> Delive Keep - Login </title>
            <link rel="icon" href="../dk.ico" />
        </Helmet>
        <Header />
        <BackGround />
        <div className="wrapper">
            <div className="container">
                <form action="/auth/login" method="POST">
                    <div className="form-input">
                        <p>E-mail ou CPF</p>
                        <input type="text" name="username" required />
                        <p>Senha</p>
                        <input type="password" name="password" required />
                    </div>
                </form>
                <div className="submit-button">
                    <input type="submit" value="Login" />
                    <input
                    type="button"
                    value="Cadastrar"
                    onClick={handleRegisterClick}
                    />
                </div>
            </div>
        </div>
    </>
  );
};

export default Login;
