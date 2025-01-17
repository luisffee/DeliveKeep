import { useState } from 'react';
import Header from '../components/Header';
import LogYou from '../components/LogYou';
import { Helmet } from 'react-helmet';
import addEnderecoBtn from '../images/addAdress.svg';
import './Pagamento.css';

function Pagamento () {
    const [showModal, setShowModal] = useState(false);
    const [pagamentos, setPagamentos] = useState([]);
    const [cardNumber, setCardNumber] = useState('');
    const [validity, setValidity] = useState('');
    const [cvv, setCvv] = useState('');
    const [nickname, setNickname] = useState('');
    const [cardholderName, setCardholderName] = useState('');

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        value = value.slice(0, 16); // Limita a 16 dígitos

        // Adiciona um espaço a cada 4 dígitos
        const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();

        setCardNumber(formattedValue);
    };

    const handleRemovePagamento = (index) => {
        const updatedPagamento = pagamentos.filter((_, i) => i !== index);
        setPagamentos(updatedPagamento);
    };

    const handleSalveCartão = (e) => {
        e.preventDefault(); // Evita o reload da página
        
        // Validações simples antes de salvar (opcional)
        if (!nickname || !cardNumber || !cardholderName || !validateValidity() || !cvv) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }
    
        const novoPagamento = {
            titulo: `Cartão ${nickname}`,
            numeroCartao: cardNumber,
            nomeTitular: cardholderName,
            validade: validity,
            cvv, // Opcional salvar, dependendo das regras de segurança
        };
    
        setPagamentos([...pagamentos, novoPagamento]); // Atualiza o estado com o novo cartão
        setShowModal(false); // Fecha o modal
        
        // Limpa os campos após salvar
        setNickname('');
        setCardNumber('');
        setCardholderName('');
        setValidity('');
        setCvv('');
    };
    
    const handleValidityChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        if (value.length > 4) {
            value = value.slice(0, 4); // Limita a 4 caracteres (MMYY)
        }

        if (value.length >= 2) {
            const month = value.slice(0, 2);
            const year = value.slice(2);

            // Adiciona uma barra entre mês e ano
            value = `${month}/${year}`;
        }

        setValidity(value);
    };

    const validateValidity = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Mês atual (0-11, então adicionamos 1)

        if (!/^\d{2}\/\d{2}$/.test(validity)) {
            return false; // Formato de validade inválido
        }

        const [month, year] = validity.split('/').map(Number);

        if (month < 1 || month > 12 || year < 25 || year < currentYear % 100 || (year === currentYear % 100 && month < currentMonth)) {
            return false; // Data de validade é anterior ao mês/ano atual
        }

        return true;
    };

    const handleCvvChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        value = value.slice(0, 3); // Limita a 3 dígitos
        setCvv(value);
    };

    const handleKeyPress = (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };

    return (
        <div id='pagamento-page'>
            <Helmet>
                <title>Delive Keep</title>
                <link rel="icon" href="../dk.ico" />
            </Helmet>
            <Header />
            <LogYou />

            <div className='pagamento-wrapper'>
                <div className='big-box'>
                    <div className='add-pagamento' onClick={() => setShowModal(true)}>
                        <p>Adicionar Pagamento</p>
                        <img src={addEnderecoBtn} alt='Adicionar Pagamento' />
                    </div>
                    {pagamentos.map((novoPagamento, index) => (
                        <div key={index} className='add-pagamento'>
                            <p>{novoPagamento.titulo}</p>
                            <p>Número: **** **** **** {novoPagamento.numeroCartao.slice(-4)}</p>
                            <p>Nome: {novoPagamento.nomeTitular}</p>
                            <p>Validade: {novoPagamento.validade}</p>
                            <p>CVV: ***</p>
                            <button className="remove-btn" onClick={() => handleRemovePagamento(index)}>Remover Pagamento</button>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Adicionar Cartão</h2>
                        <form action="">
                            <input type="text" placeholder='Apelido do Cartão' maxLength={20} value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                            <input type='text' placeholder='Número do Cartão' value={cardNumber} onChange={handleCardNumberChange} onKeyDown={handleKeyPress} required />
                            <input type='text' placeholder='Nome do Titular' value={cardholderName} onChange={(e) => setCardholderName(e.target.value)}  required />
                            <input type='text' placeholder='Validade (MM/YY)' value={validity} onChange={handleValidityChange} onKeyDown={handleKeyPress} required />
                            {!validateValidity() && <p style={{ color: 'red' }}>Data de validade inválida ou menor que 25</p>}
                            <input type='number' placeholder='CVV' value={cvv} onChange={handleCvvChange} onKeyDown={handleKeyPress} required />
                            <button type='button' onClick={handleSalveCartão}>Salvar</button>
                            <button type='button' onClick={() => setShowModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Pagamento;