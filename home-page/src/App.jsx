import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'shards-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import './index.css';

import Chat from 'chat/Chat';

const App = () => (
  <>
    <Chat />
  </>
);

ReactDOM.render(<App />, document.getElementById('app'));
