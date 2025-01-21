import { useState } from 'react';
import Header from '../components/Header';
import LogYou from '../components/LogYou';
import { Helmet } from 'react-helmet';
import './Endereco.css';
import addEnderecoBtn from '../images/addAdress.svg';
import API_GMAPS_KEY from './api';
import { addAdress, deleteAdress } from '../controllers/user-controllers';

const FURG_COORDS = { lat: -32.066157, lng: -52.175553 }; // Coordenadas da FURG

function Endereco() {
    const [gasolinePrice, setGasolinePrice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cep, setCep] = useState('');
    const [enderecos, setEnderecos] = useState([]);
    const [number, setNumber] = useState('');
    const [titulo, setTitulo] = useState('');
    const [address, setAddress] = useState({
        rua: '',
        complemento: '',
        cidade: '',
        bairro: '',
        estado: '',
        cep: '',
    });

    const fetchGasolinePrice = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/gasolinePrice');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const formattedPrice = data.gasoline_price.replace(',', '.');
            setGasolinePrice(formattedPrice); // valor do preço da gasolina
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
        }
    };

    const fetchCoordinates = async (cep) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                const { localidade, uf, logradouro } = data;
                const fullAddress = `${logradouro}, ${localidade}, ${uf}, Brazil`;
                const geocodingResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        fullAddress
                    )}&key=${API_GMAPS_KEY}`
                );                
                const geocodingData = await geocodingResponse.json();
                if (geocodingData.results.length > 0) {
                    const { lat, lng } = geocodingData.results[0].geometry.location;
                    return { lat, lng };
                }
            }
        } catch (error) {
            console.error('Erro ao buscar coordenadas:', error);
        }
        return null;
    };

    const calculateDistance = (coords1, coords2) => {
        const R = 6371; // Raio da Terra em km
        const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
        const dLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((coords1.lat * Math.PI) / 180) *
                Math.cos((coords2.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distância em km
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
                        estado: data.uf,
                        cep: newCep,
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleSaveEndereco = async () => {
        if (!cep || !titulo || !number || !address.rua || !address.bairro) {
            alert('Preencha todos os campos!');
            return;
        }

        await fetchGasolinePrice();
    
        const coords = await fetchCoordinates(cep);
        if (coords) {
            const distance = calculateDistance(coords, FURG_COORDS);
            const multipliedDistance = distance * 2;
    
            const newEndereco = {
                titulo,
                rua: address.rua,
                number,
                bairro: address.bairro,
                cep,
                distance: multipliedDistance.toFixed(2),
            };
    
            setEnderecos((prevEnderecos) => [...prevEnderecos, newEndereco]);
            setShowModal(false);
    
            // Limpar os campos após salvar
            setCep('');
            setNumber('');
            setTitulo('');
            setAddress({
                rua: '',
                complemento: '',
                cidade: '',
                bairro: '',
                estado: '',
                cep: '',
            });

            try {
                const response = await addAdress(newEndereco);
                if(response && response.status === 200){
                    return
                } else {
                    alert('Erro ao adicionar endereço');
                }
        
            } catch (error) {
                console.error('Erro ao adicionar endereço:', error);
            }

        } else {
            alert('Erro ao buscar coordenadas do endereço.');
        }
    };    

    const handleRemoveEndereco = async (index) => {
        const updatedEnderecos = enderecos.filter((_, i) => i !== index);
        setEnderecos(updatedEnderecos);
        try {
            const response = await deleteAdress({ titulo: enderecos[index].titulo });
            if(response && response.status === 200){
                return
            } else {
                alert('Erro ao remover endereço');
            }

        } catch (error) {
            console.error('Erro ao remover endereço:', error);
        }
    };  

    return (
        <div id="endereco-page">
            <Helmet>
                <title>Delive Keep</title>
                <link rel="icon" href="../dk.ico" />
            </Helmet>
            <Header />
            <LogYou />

            <div className='endereco-wrapper'>
                <div className='big-box'>
                    <div className='add-endereco' onClick={() => setShowModal(true)}>
                        <p>Adicionar Endereço</p>
                        <img src={addEnderecoBtn} alt='Adicionar Endereço' />
                    </div>
                    {enderecos.map((endereco, index) => (
                        <div key={index} className='add-endereco'>
                            <p>{endereco.titulo}</p>
                            <p>Rua: {endereco.rua}</p>
                            <p>Bairro: {endereco.bairro}</p>
                            <p>Número: {endereco.number}</p>
                            <p>CEP: {endereco.cep}</p>
                            <p>
                                Valor: R$
                                {gasolinePrice
                                    ? (gasolinePrice / 10.5 * endereco.distance + 15).toFixed(2)
                                    : 'Carregando...'}
                            </p>{/* Cálculo do valor: preço da gasolina, dividido por km/l de uma van convencional, multiplicado pela distancia até o endereço, somando taxa de serviço */}
                            <button className="remove-btn" onClick={() => handleRemoveEndereco(index)}>Remover endereço</button>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Adicionar Endereço</h2>
                        <form action="">
                            <input type="number" placeholder="CEP" value={cep} onChange={handleCepChange} required />
                            <input type="text" placeholder="Rua" value={address.rua} onChange={(e) => setAddress({ ...address, rua: e.target.value })} required />
                            <input type="text" placeholder="Bairro" value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })} required />
                            <input type="number" placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} required />
                            <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                            <button type='button' onClick={handleSaveEndereco}>Salvar</button>
                            <button type='button' onClick={() => setShowModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Endereco;
