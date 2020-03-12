import React from 'react';
import { Link as ReactLink } from "react-router-dom";
import { Button, Typography } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

import "./Top.css"


interface TopPropsInterface {}
interface ToppropsInterface {}

class Top extends React.Component<TopPropsInterface, ToppropsInterface> {
  constructor(props: TopPropsInterface) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Top">
        <Typography variant="h1">n0bbs</Typography>
        <Button variant="outlined" color="primary" href="/auth/login/github/">Login with <GitHubIcon /></Button>
      </div>
    );
  }
}


export default Top;
