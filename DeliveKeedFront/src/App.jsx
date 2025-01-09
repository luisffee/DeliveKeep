import Header from './components/Header';
import LogYou from './components/LogYou';
import Wrap from './components/Wrap';
import './App.css';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div>
      <Helmet>
        <title>Delive Keep</title>
        <link rel="icon" href="../dk.ico" />
      </Helmet>
      <Header />
      <LogYou />
      <Wrap />
    </div>
  );
}

export default App;
