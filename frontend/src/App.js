import React from 'react';
import LoadingScreen from 'react-loading-screen';
import Routes from './routes';
import { isAuth, login, logout } from './services/auth';
import api from './services/api';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  refresh = () => {
    api.get('/auth/refresh')
       .then((response) => {
         const { data } = response;

         login(data.token);

         this.setState({ 
           loading: false
         });
       })
       .catch((error) => {
         logout();

         this.setState({ 
           loading: false
         });
       });
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
         .then((response) => {
           this.setState({ 
             loading: false
           });
         })
         .catch((error) => {
           this.refresh();
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
        textColor="#676767"
        text=""
      >
        <Routes />
      </LoadingScreen>
    );
  }
}
