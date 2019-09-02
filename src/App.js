import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';
import { BrowserRouter,Route } from 'react-router-dom';

class App extends Component {

  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path="/translator" exact render={(props) => <Search {...props}/>} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
