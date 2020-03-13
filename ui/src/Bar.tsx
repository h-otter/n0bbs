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
  Link,
  Divider,
 } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import Push from "push.js"

import ThreadDialog from './ThreadDialog'


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
}

class Bar extends React.Component<BarThreadsPropsInterface, BarThreadsStateInterface> {
  websocket: WebSocket;

  constructor(props: BarThreadsPropsInterface) {
    super(props);

    this.state = {
      drawer: false,
      dialog: false,
    };

    this.openDialog = this.openDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)

    let url = ""
    if (window.location.protocol === "https:") {
      url = 'wss://';
    } else {
      url = 'ws://';
    }
    url += window.location.host+'/api/ws/channel/';
    this.websocket = new WebSocket(url);
    this.websocket.onclose = (e) => {
      // TODO: 再接続処理！！！
      // Push.create("websocket is closed, please reload", {
      //   onClick: function () {
      //       window.focus();
      //   }
      // });
    };
    this.websocket.onmessage = (e) => {
      let data = JSON.parse(e.data)

      switch (data.type) {
      case "new_response":
        Push.create("", {
          body: data.message.thread_title + ": " + data.message.comment,
          onClick: function () {
              window.focus();
          }
        });

        break;
      }
    }
  }

  componentWillUnmount() {
    this.websocket.close();
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
          </List>
        </Drawer>

        <ThreadDialog open={ this.state.dialog } onClose={ this.closeDialog } />
      </div>
    );
  }
}


export default Bar;
