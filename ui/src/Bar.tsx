import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { 
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  useScrollTrigger,
  Typography,
  Box,
 } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


// https://material-ui.com/components/app-bar/#hide-app-bar
interface HideOnScrollProps {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}


interface BarThreadsPropsInterface {
  children: React.ReactElement;
}

interface BarThreadsStateInterface {}

class Bar extends React.Component<BarThreadsPropsInterface, BarThreadsStateInterface> {
  constructor(props: BarThreadsPropsInterface) {
    super(props);

    this.state = {
    };
  }
  
  render() {
    return (
      <div className="bar">
        <HideOnScroll {...this.props}>
          <AppBar>
            <Toolbar variant="dense">
              <Typography variant="h6">
                n0bbs
              </Typography>
              <IconButton color="inherit" href="/api/threads:new">
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton color="inherit" href="/auth/logout">
                <ExitToAppIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar variant="dense" />
        { this.props.children }
      </div>
    );
  }
}


export default Bar;
