import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';

import { DefaultApi } from './axios-client/api';


interface AuthRequiredPropsInterface {
  children: React.ReactElement[];
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
      <div className="bar">
        { this.state.isLoggedIn ? this.props.children : <a href="/auth/login/github/">Login with <GitHubIcon /></a> }
      </div>
    );
  }
}



export default AuthRequired;
