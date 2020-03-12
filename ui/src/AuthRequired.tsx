import React from 'react';
import { Redirect } from "react-router-dom";

import { DefaultApi } from './axios-client/api';


interface AuthRequiredPropsInterface {
  children: React.ReactElement;
}

interface AuthRequiredStateInterface {
  isLoggedIn: boolean;
}

class AuthRequired extends React.Component<AuthRequiredPropsInterface, AuthRequiredStateInterface> {
  constructor(props: AuthRequiredPropsInterface) {
    super(props);
    
    this.state = {
      isLoggedIn: true,
    };

    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl }).listThreads().catch((err) => {
      // TODO: 403か判断する
      this.setState({isLoggedIn: false})
      console.log(err)
    })
  }
  
  render() {
    return (
      <div className="Bar">
        { this.state.isLoggedIn ? this.props.children : <Redirect to="/" /> }
      </div>
    );
  }
}



export default AuthRequired;
