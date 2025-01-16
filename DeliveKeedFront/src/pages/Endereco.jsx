import { useState } from 'react';
import Header from '../components/Header';
import LogYou from '../components/LogYou';
import { Helmet } from 'react-helmet';
import './Endereco.css';
import addEnderecoBtn from '../images/addAdress.svg';

const FURG_COORDS = { lat: -32.066157, lng: -52.175553 }; // Coordenadas da FURG

function Endereco() {
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
                    )}&key=YOUR_GOOGLE_MAPS_API_KEY`
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
        const coords = await fetchCoordinates(cep);
        if (coords) {
            const distance = calculateDistance(coords, FURG_COORDS);
            const multipliedDistance = distance * 2; // Multiplica a distância por 2 (ou outro fator)

            const newEndereco = {
                titulo,
                rua: address.rua,
                number,
                bairro: address.bairro,
                cep: address.cep,
                distance: multipliedDistance.toFixed(2), // Formata com 2 casas decimais
            };
            setEnderecos([...enderecos, newEndereco]);
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
        } else {
            alert('Erro ao buscar coordenadas do endereço.');
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
                            <p>Distância até a FURG (x2): {endereco.distance} km</p>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h2>Adicionar Endereço</h2>
                        <input type="text" placeholder="CEP" value={cep} onChange={handleCepChange} required />
                        <input type="text" placeholder="Rua" value={address.rua} readOnly />
                        <input type="text" placeholder="Bairro" value={address.bairro} readOnly />
                        <input type="text" placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} required />
                        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                        <button onClick={handleSaveEndereco}>Salvar</button>
                        <button onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Endereco;
