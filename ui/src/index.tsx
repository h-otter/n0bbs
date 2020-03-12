import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import { CssBaseline } from '@material-ui/core';

import './index.css';
import * as serviceWorker from './serviceWorker';
import Top from './Top';
import ListThreads from './ListThreads';
import ThreadDetails from './ThreadDetails';
import AuthRequired from './AuthRequired';


const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: teal,
  },
});


ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Switch>
        <Route exact path="/" component={Top}></Route>
        <AuthRequired>
          <Switch>
            <Route exact path="/threads/" component={ListThreads}></Route>
            <Route path="/threads/:id" component={ThreadDetails}></Route>
            <Redirect to="/"></Redirect>
          </Switch>
        </AuthRequired>
      </Switch>
    </Router>
  </MuiThemeProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
