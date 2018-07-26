import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import TestPage from './TestPage';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={App}/>
      <Route exact path='/test' component={TestPage}/>
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
