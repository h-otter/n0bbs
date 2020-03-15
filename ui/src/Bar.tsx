import React from 'react';
import { Link as ReactLink } from "react-router-dom";
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
  ListSubheader,
  Link,
  Divider,
 } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';

import ThreadDialog from './ThreadDialog'
import { DefaultApi, InlineResponse2003Results } from './axios-client/api';


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
  dialog: boolean;
  channels: InlineResponse2003Results[];
}

class Bar extends React.Component<BarThreadsPropsInterface, BarThreadsStateInterface> {
  constructor(props: BarThreadsPropsInterface) {
    super(props);

    this.state = {
      drawer: false,
      dialog: false,
      channels: [],
    };

    this.openDialog = this.openDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)

    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl }).listChannels().then((res) => {
      if (res.data.results !== undefined) {
        this.setState({channels: res.data.results});
      }
    })
  }

  openDialog() {
    this.setState({dialog: true});
  }
  closeDialog() {
    this.setState({dialog: false});
  }


  render() {
    return (
      <div className="bar">
        <HideOnScroll>
          <AppBar color="inherit">
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={ () => {this.setState({drawer: true})} }>
                <MenuIcon />
              </IconButton>
              <Link href="/threads" color="inherit"><Typography variant="h6">n0bbs</Typography></Link>
              <div style={{ flexGrow: 1 }}></div>
              <IconButton color="inherit" onClick={ this.openDialog }>
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
            <ListItem button component={ReactLink} to={ "/threads/" }>
              <ListItemText primary="All Threads" />
            </ListItem>
            <Divider />

            <ListSubheader>
              Channels
            </ListSubheader>
            { this.state.channels.map((c) => (
              <ListItem button component={ReactLink} to={ "/channels/"+c.id+"/threads/" }>
                <ListItemText primary={ "@"+c.name } />
              </ListItem>
            )) }

            {/* <ListSubheader>
              Muted Channels
            </ListSubheader>
            { this.state.channels.map((c) => (
              <ListItem button component={ReactLink} to={ "/channels/"+c.id+"/threads/" }>
                <ListItemText primary={ "@"+c.name } />
              </ListItem>
            )) } */}

            {/* <ListSubheader>
              Invited Channels
            </ListSubheader>
            { this.state.channels.map((c) => (
              <ListItem button component={ReactLink} to={ "/channels/"+c.id+"/threads/" }>
                <ListItemText primary={ "@"+c.name } />
              </ListItem>
            )) } */}
            {/* TODO: add channel */}
          </List>
        </Drawer>

        <ThreadDialog open={ this.state.dialog } onClose={ this.closeDialog } />
      </div>
    );
  }
}


export default Bar;
