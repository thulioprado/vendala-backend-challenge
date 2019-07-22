import React from 'react';
import LoadingScreen from 'react-loading-screen';
import Routes from './routes';
import { isAuth } from './services/auth';
import api from './services/api';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    // fix theme
    const root = document.getElementById('root');

    for (let i = 0; i < root.childNodes.length; ++i) {
      if (root.childNodes[i].nodeType === 1) {
        root.childNodes[i].classList.add('h-100');
      }
    }

    if (isAuth()) {
      // Verifica se é uma sessão válida
      // Caso não seja, atualiza a sessão
      api.get('/auth/ping')
         .then(() => {
           this.setState({ 
             loading: false
           });
         });
    } else {
      setTimeout(() => this.setState({ 
        loading: false
      }), 750);
    }
  }

  render() {
    const { loading } = this.state;

    return (
      <LoadingScreen
        loading={loading}
        bgColor="#f4f4f4"
        spinnerColor="#36b6ff"
        logoSrc={require('./assets/logo.png')}
        textColor="#606060"
        text=""
        >
        <Routes />
      </LoadingScreen>
    );
  }
}
