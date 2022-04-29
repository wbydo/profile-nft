import * as React from 'react';
import { FC } from 'react';
import * as ReactDOM from 'react-dom';

import { Top } from './components/pages/Top';

import './main.css';

const App: FC = () => <Top />;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
