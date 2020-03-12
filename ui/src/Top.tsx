import React from 'react';
import { Link as ReactLink } from "react-router-dom";
import { Button, Typography } from '@material-ui/core';

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
        <Button
          variant="outlined"
          color="primary"
          component={ ReactLink }
          to="/threads"
        >
          Get Started
        </Button>
      </div>
    );
  }
}


export default Top;
