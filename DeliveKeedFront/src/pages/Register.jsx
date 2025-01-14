import './Register.css';
import Header from '../components/Header';
import BackGround from '../components/BackGround';
import { Helmet } from 'react-helmet';
import { useState } from 'react';

const Register = () => {

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, '') // Remove any non-digit character
            .slice(0, 11) // Ensure the CPF has a maximum length of 14 digits before formatting
            .replace(/(\d{3})(\d)/, '$1.$2') // Add a dot after the first 3 digits
            .replace(/(\d{3})(\d)/, '$1.$2') // Add a dot after the next 3 digits
            .replace(/(\d{3})(\d{2})$/, '$1-$2'); // Add a dash before the last 2 digits
    };

    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState({
        endereco: '',
        rua: '',
        complemento: '',
        cidade: '',
        bairro: '',
        estado: ''
    });

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
                                    <input type="text" placeholder="Nome" required />
                                    <input type="text" placeholder="Número de contato" required />
                                    <input type="date" placeholder="Data de nascimento" required />
                                    <input type="password" placeholder="Senha" required />
                                </div>
                                <div className='register-column'>
                                    <input type="text" placeholder="Sobrenome" required />
                                    <input type="email" placeholder="E-mail" required />
                                    <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} required />
                                    <input type="password" placeholder="Confirme sua senha" required />
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
                                    <input type="text" placeholder="Observação" />
                                </div>
                                <div className='register-column'>
                                    <input type="text" placeholder="Rua" value={address.rua} onChange={(e) => setAddress({ ...address, rua: e.target.value })} required />
                                    <input type="text" placeholder="Número" required />
                                    <input type="text" placeholder="Bairro" value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })} required />
                                    <input type="text" placeholder="Estado" value={address.estado} onChange={(e) => setAddress({ ...address, estado: e.target.value })} required />
                                </div>
                            </div>
                            <div className='lastRegBtn'>
                                <button className='registerBtn' onClick={handlePreviousStep}>Voltar</button>
                                <button className='registerBtn' >Finalizar</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Register;