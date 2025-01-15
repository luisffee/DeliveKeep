import './Register.css';
import Header from '../components/Header';
import BackGround from '../components/BackGround';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { registerUser } from "../controllers/user-controllers";
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate()

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '') // Remove any non-digit character
            .slice(0, 11) // Ensure the CPF has a maximum length of 14 digits before formatting
            .replace(/(\d{3})(\d)/, '$1.$2') // Add a dot after the first 3 digits
            .replace(/(\d{3})(\d)/, '$1.$2') // Add a dot after the next 3 digits
            .replace(/(\d{3})(\d{2})$/, '$1-$2'); // Add a dash before the last 2 digits
    };

    const [Observation, setObservation] = useState('');
    const [number, setNumber] = useState('');
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({
        rua: '',
        complemento: '',
        cidade: '',
        bairro: '',
        estado: '',
    });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [numberContact, setNumberContact] = useState('');

    const handleCpfChange = (e) => {
        setCpf(formatCPF(e.target.value));
    };

    const handleCepChange = async (e) => {
        const newCep = e.target.value;
        setCep(newCep);

        if (newCep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setAddress({
                        rua: data.logradouro,
                        complemento: data.complemento,
                        cidade: data.localidade,
                        bairro: data.bairro,
                        estado: data.uf
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep(2);
    };

    const handlePreviousStep = () => {
        setStep(1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Impede o comportamento padrão de envio

        // Verifique se as senhas são iguais antes de enviar os dados
        if (password1 !== password2) {
        setPasswordError(true);
        return; // Impede o envio se as senhas não coincidirem
        }
    
        setPasswordError(false); // Limpa o erro se as senhas coincidirem

        const formattedAddress = `${address.rua}, ${address.complemento}, ${address.cidade}, ${address.bairro}, ${address.estado}`;

        const registerInfo = {
            address: formattedAddress,
            name,
            email,
            password1,
            password2,
            cpf,
            date_of_birth: dateOfBirth,
            numberContact
        };
    
        // Chama a função registerUser passando os dados
        try {
            const response = await registerUser(registerInfo);
            if(response && response.status === 200){
                navigate('/')
            } else {
                alert('Erro ao registrar usuário!')
            }
    
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            alert("Erro ao registrar usuário: Verifique os dados e tente novamente.");
        }
    };

    return (
        <>
            <Helmet>
                <title> Delive Keep - Registro </title>
                <link rel="icon" href="../dk.ico" />
            </Helmet>
            <Header />
            <BackGround />
            <div className="wrapperReg">
                <div className='containerReg'>
                    {step === 1 ? (
                        <>
                            <div className="register-columns">
                                <div className='register-column'>
                                    <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
                                    <input type="text" placeholder="Número de contato" value={numberContact} onChange={(e) => setNumberContact(e.target.value)} required />
                                    <input type="date" placeholder="Data de nascimento" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                                    <input type="password" placeholder="Senha" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                                </div>
                                <div className='register-column'>
                                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} required />
                                    <input type="password" placeholder="Confirme sua senha" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                                    {passwordError && (
                                    <div style={{ color: "red", fontSize: "0.875em" }}>
                                        As senhas não coincidem
                                    </div>
                                    )}
                                </div>
                            </div>
                            <button className='registerBtn' onClick={handleNextStep}>Continuar</button>
                        </>
                    ) : (
                        <>
                            <div className="register-columns">
                                <div className='register-column'>
                                    <input type="text" placeholder="CEP" value={cep} onChange={handleCepChange} required />
                                    <input type="text" placeholder="Complemento" value={address.complemento} onChange={(e) => setAddress({ ...address, complemento: e.target.value })} required />
                                    <input type="text" placeholder="Cidade" value={address.cidade} onChange={(e) => setAddress({ ...address, cidade: e.target.value })} required />
                                    <input type="text" placeholder="Observação" value={Observation} onChange={() => setObservation()} />
                                </div>
                                <div className='register-column'>
                                    <input type="text" placeholder="Rua" value={address.rua} onChange={(e) => setAddress({ ...address, rua: e.target.value })} required />
                                    <input type="text" placeholder="Número" value={number} onChange={() => setNumber} required />
                                    <input type="text" placeholder="Bairro" value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })} required />
                                    <input type="text" placeholder="Estado" value={address.estado} onChange={(e) => setAddress({ ...address, estado: e.target.value })} required />
                                </div>
                            </div>
                            <div className='lastRegBtn'>
                                <button className='registerBtn' onClick={handlePreviousStep}>Voltar</button>
                                <button className='registerBtn' onClick={handleSubmit}>Finalizar</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Register;