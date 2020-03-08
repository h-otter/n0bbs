import React from 'react';
import { AppBar, Container, TextField } from '@material-ui/core';
import { RouteComponentProps } from "react-router-dom";
import Push from "push.js"

import "./ThreadDetails.css";
import Response from './Response';
import ResponseInstance from './ResponseInstance';



interface ThreadDetailsPropsInterface extends RouteComponentProps<{ id: string }> {}

interface ThreadDetailsStateInterface {
  responses: ResponseInstance[];
  websocket: WebSocket;

  displayName: string;
  comment: string;
}

class ThreadDetails extends React.Component<ThreadDetailsPropsInterface, ThreadDetailsStateInterface> {
  constructor(props: ThreadDetailsPropsInterface) {
    super(props);

    let url = ""
    if (window.location.protocol === "https:") {
      url = 'wss://';
    } else {
      url = 'ws://';
    }
    url += window.location.host+'/api/ws/thread/'+this.props.match.params.id;


    this.state = {
      responses: [],
      websocket: new WebSocket(url),

      displayName: "n0nameさん",
      comment: "",
    };

    this.state.websocket.onclose = (e) => {
      // TODO: thread title
      Push.create("websocket is closed, please reload", {
        onClick: function () {
            window.focus();
        }
      });
    };
    this.state.websocket.onmessage = (e) => {
      let data = JSON.parse(e.data)
      console.log(data)
    
      switch (data.type) {
      case "all_responses":
        this.setState({
          responses: data.message.responses,
        })
        break;
    
      case "new_response":
        let responses = this.state.responses
        responses.push(data.message)
        this.setState({
          responses: responses,
        })
    
        // TODO: 自分が送ったものの通知はいらない
        Push.create("", {
          body: data.message.comment,
          onClick: function () {
              window.focus();
          }
        });


        // TODO: ページのスクロールが最下部だったら以下を実行する
        // window.location.hash = "#r"+this.state.responses.length;

        
        break;
      }
    }
  }

  sendResponse = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      if (this.state.comment === "") {
        return
      }

      this.state.websocket.send(JSON.stringify({
        'type': 'new_response',
        'message': {
          'display_name': this.state.displayName,
          'comment': this.state.comment,
        },
      }));

      this.setState({comment: ""});
    }
  }

  renderResponses() {
    let list: any[] = [];

    this.state.responses.forEach((r, i) => {
      list.push(<Response unread={ true } i={ i } responses={ this.state.responses } />)
    })

    return <Container id="responses" maxWidth="xl">{ list }</Container>
  }

  componentWillUnmount = () => {
    this.state.websocket.close();
  }

  render() {
    return (
      <div className="thread-details">
        { this.renderResponses() }
        {/* TODO: stickyはレス数が少ないときに表示が崩れる */}
        <AppBar position="sticky" color="inherit" id="response-form">
          <Container maxWidth="md">
            <TextField
              id="outlined-multiline-flexible"
              label="Name"
              fullWidth
              variant="outlined"
              margin="dense"
              value={ this.state.displayName }
              onChange={ (e) => this.setState({displayName: e.target.value}) }
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Comment"
              autoFocus
              fullWidth
              multiline
              rowsMax="4"
              variant="outlined"
              margin="dense"
              value={ this.state.comment }
              onChange={ (e) => this.setState({comment: e.target.value}) }
              onKeyDown={ this.sendResponse }
            />
          </Container>
        </AppBar>
      </div>
    );
  }
}


export default ThreadDetails;
