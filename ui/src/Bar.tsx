import React from 'react';
import { Link } from "react-router-dom";
import {
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  useScrollTrigger,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
 } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';


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

interface BarThreadsStateInterface {
  drawer: boolean;
}

class Bar extends React.Component<BarThreadsPropsInterface, BarThreadsStateInterface> {
  constructor(props: BarThreadsPropsInterface) {
    super(props);

    this.state = {
      drawer: false,
    };
  }

  render() {
    return (
      <div className="bar">
        <HideOnScroll>
          <AppBar>
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={ () => {this.setState({drawer: true})} }>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                n0bbs
              </Typography>
              <div style={{ flexGrow: 1 }}></div>
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

        <Drawer 
          open={ this.state.drawer } 
          onClose={ () => {this.setState({drawer: false})} }
        >
          <List dense={ true } style={{width: 240}}>
            <ListItem button component={Link} to={ "/threads/" }>
              <ListItemText primary="All Threads" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  }
}


export default Bar;
