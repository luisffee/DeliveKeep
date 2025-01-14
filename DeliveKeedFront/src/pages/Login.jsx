import './Login.css';
import Header from '../components/Header';
import BackGround from '../components/BackGround';
import { Helmet } from 'react-helmet';
import { loginUser} from '../controllers/user-controllers';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally, you can verify the token with the backend here
      navigate('/');
    }
  }, [navigate]);
  
  const handleRegisterClick = () => {
    navigate('/register')
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const response = await loginUser(email, password);
      if(response && response.status === 200){
        navigate('/')
      } else {
        alert('Erro no login!')
      }

    } catch (error) {
      console.log("Erro no login:", error);
      alert("Falha ao fazer login. Verifique suas credenciais.");
    }
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
                <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <p>E-mail</p>
                        <input type="email" name="email" id="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <p>Senha</p>
                        <input type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="submit-button">
                        <input type="submit" value="Login" />
                        <input
                        type="button"
                        value="Cadastrar"
                        onClick={handleRegisterClick}
                        />
                    </div>
                </form>
            </div>
        </div>
    </>
  );
};

export default Login;
