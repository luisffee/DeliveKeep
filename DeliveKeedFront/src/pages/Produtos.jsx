import { useState } from 'react';
import Header from '../components/Header';
import LogYou from '../components/LogYou';
import { Helmet } from 'react-helmet';
import './Produtos.css';
import addEnderecoBtn from '../images/addAdress.svg';
import defaultProdImg from '../images/defaultProd.svg';

const Produtos = () => {
    const [nomeProduto, setNomeProduto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [rastreio, setRastreio] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleSalveProduto = async (e) => {
        e.preventDefault(); // Evita o reload da página

        // Validações simples antes de salvar (opcional)
        if (!nomeProduto || !descricao || !email || !telefone || !rastreio) {
            alert('Por favor, preencha todos os campos corretamente!');
            return;
        }

        const novoProduto = {
            nomeProduto,
            descricao,
            email,
            telefone,
            rastreio,
        };

        setProdutos([...produtos, novoProduto]); // Atualiza o estado com o novo produto
        setShowModal(false); // Fecha o modal

        // Limpa os campos após salvar
        setNomeProduto('');
        setDescricao('');
        setEmail('');
        setTelefone('');
        setRastreio('');
    };

    const handleRemoveProduto = (index) => {
        const novosProdutos = produtos.filter((_, i) => i !== index);
        setProdutos(novosProdutos);
    };

    return (
        <div id='produtos-page'>
            <Helmet>
                <title>Delive Keep</title>
                <link rel="icon" href="../dk.ico" />
            </Helmet>
            <Header />
            <LogYou />

            <div className='produto-wrapper'>
                <div className='big-box'>
                    <div className='add-produto' onClick={() => setShowModal(true)}>
                        <p>Adicionar produto</p>
                        <img className='add-prod-img' src={addEnderecoBtn} alt='Adicionar produto' />
                    </div>
                    {produtos.map((novoproduto, index) => (
                        <div key={index} className='added-produto'>
                            <p className='nome-prod'>{novoproduto.nomeProduto}</p>
                            <div className='img-desc'>
                                <img className='img-prod-padrao' src={defaultProdImg} alt="Imagem padrão de produto" />
                                <div className='texto-e-botoes'>
                                    <p className='descricao-prod'>Descrição: {novoproduto.descricao}</p>
                                    <p className='descricao-prod'>Código de Rastreio: {novoproduto.rastreio}</p>
                                    <p className='descricao-prod'>E-mail: {novoproduto.email}</p>
                                    <p className='descricao-prod'>Telefone: {novoproduto.telefone}</p>
                                    <div className='dest-produto'>
                                        <button className="prod-btn">Retirar em nosso local</button>
                                        <button className="prod-btn">Receber em casa</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Adicionar Produto</h2>
                        <form action="">
                            <div className='form-group'></div>
                            <input type="text" placeholder='Nome do Produto' value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} />
                            <input type="text" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="text" placeholder='Telefone' value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                            <input type="text" placeholder='Código de Rastreio' value={rastreio} onChange={(e) => setRastreio(e.target.value)} />
                            <textarea name="Descriao" placeholder='Descrição' value={descricao} onChange={(e) => setDescricao(e.target.value)} id=""></textarea>
                            <button type='button' onClick={handleSalveProduto}>Salvar</button>
                            <button type='button' onClick={() => setShowModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Produtos;