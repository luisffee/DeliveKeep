import Header from '../components/Header';
import LogYou from '../components/LogYou';
import '../App.css';
import './Info.css';
import { Helmet } from 'react-helmet';

function Info() {
  return (
    <div>
      <Helmet>
        <title>Delive Keep</title>
        <link rel="icon" href="../dk.ico" />
      </Helmet>
      <Header />
      <LogYou />
      <div className='info-wrapper'>
        <div className='info-container'>
          <div className='info-text'>
            <p>1. Após o recebimento do produto é necessário que o cliente deve escolher o destino do produto. Nossos serviços compreendem 3 modalidades.</p>
            <div className='info-list'>
              <p>1.1  Retire o produto diretamente em nossa sede: Nessa modalidade a retirado do produto não gera custos adicionais além da taxa de recebimento.</p>
              <p>1.2 Receba o seu produto em casa: Nessa modalidade será cobrado o valor referente ao deslocamento da nossa sede até o endereço de entrega.</p>
              <p>1.3 Escolha um parceiro onde deseja retirar o produto: Nessa modalidade será cobrado o valor referente ao deslocamento da nossa sede até o endereço de entrega.</p>
            </div>
            <p>2. Após o recebimento do produto em nossa sede, é dever do cliente das um destino ao produto em até 7 dia corridos. No caso de não haver destinação do produto será cobrada uma taxa pelo espaço ocupado em nossa sede. O valor da taxa é de mesmo valor da nossa cobrança pelo serviço de recebimento do produto.</p>
            <p>3. Em caso de duvidas entre em contato conosco através do canais de atendimento:</p>
            <div className='info-list'>
              <p>Telefone: (53) 9 8534-6765</p>
              <p>Whatsapp: (53) 9 8534-6765</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
