import React, { Component } from 'react';
import './App.css';
import InfoTable from './InfoTable.js';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <InfoTable />
      </div>
    );
  }
}

export default App;
