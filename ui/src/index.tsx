import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './index.css';
import * as serviceWorker from './serviceWorker';
import ListThreads from './ListThreads';
import ThreadDetails from './ThreadDetails';


ReactDOM.render(
  <Router>
    <Route exact path="/threads/" component={ListThreads}></Route>
    <Route path="/threads/:id" component={ThreadDetails}></Route>
  </Router>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
