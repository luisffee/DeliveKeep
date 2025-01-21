import { useState, useEffect } from 'react';
import Header from '../components/Header';
import LogYou from '../components/LogYou';
import { Helmet } from 'react-helmet';
import addEnderecoBtn from '../images/addAdress.svg';
import './Atendimento.css';
import { addAtendimento, getAtendimentos } from '../controllers/user-controllers';

function Atendimento () {
    const [showModal, setShowModal] = useState(false);
    const [atendimentos, setAtendimentos] = useState([]);
    const [assunto, setAssunto] = useState('');
    const [email, setEmail] = useState('');
    const [codigoProduto, setCodigoProduto] = useState('');
    const [telefone, setTelefone] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        const fetchAtendimentos = async () => {
            try {
                const response = await getAtendimentos();
                setAtendimentos(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Erro ao obter atendimentos:', error);
            }
        };
        fetchAtendimentos();
    }, []);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateTelefone = (telefone) => {
        return /^\d{11}$/.test(telefone);
    };

    const handleSalveAtendimento = async (e) => {
        e.preventDefault();

        if (!assunto || !email || !codigoProduto || !telefone || !descricao) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }

        if (!validateEmail(email)) {
            alert('Por favor, insira um e-mail válido!');
            return;
        }

        if (!validateTelefone(telefone)) {
            alert('O telefone deve conter exatamente 11 números!');
            return;
        }
    
        const novoAtendimento = {
            assunto,
            email,
            codigoProduto,
            telefone,
            descricao
        };
    
        setAtendimentos([...atendimentos, novoAtendimento]);
        setShowModal(false);
        
        setAssunto('');
        setEmail('');
        setCodigoProduto('');
        setTelefone('');
        setDescricao('');
    
        try {
            const response = await addAtendimento(novoAtendimento);
            if (!response || response.status !== 200) {
                alert('Erro ao adicionar atendimento');
            }
        } catch (error) {
            console.error('Erro ao adicionar atendimento:', error);
        }
    };
    
    return (
        <div id='atendimento-page'>
            <Helmet>
                <title>Delive Keep</title>
                <link rel="icon" href="../dk.ico" />
            </Helmet>
            <Header />
            <LogYou />

            <div className='atendimento-wrapper'>
                <div className='big-box'>
                    <div className='add-atendimento' onClick={() => setShowModal(true)}>
                        <p>Adicionar Atendimento</p>
                        <img src={addEnderecoBtn} alt='Adicionar Atendimento' />
                    </div>
                </div>
            </div>

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Adicionar Atendimento</h2>
                        <form onSubmit={handleSalveAtendimento}>
                            <input type="text" placeholder="Escolha um assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)} required />
                            <input type='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type='text' placeholder='Código do produto' value={codigoProduto} onChange={(e) => setCodigoProduto(e.target.value)} required />
                            <input type='text' placeholder='Telefone com (ddd)' value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
                            <textarea placeholder='Descrição' className='desc' value={descricao} onChange={(e) => setDescricao(e.target.value)} required />

                            <div className='buttonpack'>
                                <button type='submit'>Salvar</button>
                                <button type='button' onClick={() => setShowModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Atendimento;