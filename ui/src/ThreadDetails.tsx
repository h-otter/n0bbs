import React from 'react';
import {
  Container,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
 } from '@material-ui/core';
import { RouteComponentProps } from "react-router-dom";
import Push from "push.js"

import "./ThreadDetails.css";
import Response from './Response';
import ResponseInstance from './ResponseInstance';
import { DefaultApi, InlineResponse200Results } from './axios-client/api';
import Bar from './Bar';


interface ThreadDetailsPropsInterface extends RouteComponentProps<{ id: string }> {}

interface ThreadDetailsStateInterface {
  responses: ResponseInstance[];
  websocket: WebSocket;

  isOpenDialog: boolean;
  displayName: string;
  comment: string;

  thread: InlineResponse200Results;
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

      isOpenDialog: false,
      displayName: "n0nameさん",
      comment: "",

      thread: {
        title: "",
      },
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


      let responses: ResponseInstance[] = []
      switch (data.type) {
      case "all_responses":
        responses = data.message.responses
        responses.forEach((res, i) => {
          let result = res.comment.match(/&gt;&gt;\d+/g)
          result?.map((v) => {
            return parseInt(v.replace("&gt;&gt;", "")) - 1
          }).forEach((v) => {
            console.log(""+v+i)
            if (responses[v].referenced === undefined) {
              responses[v].referenced = [i]
            } else {
              responses[v].referenced?.push(i)
            }
          })
        })

        this.setState({
          responses: data.message.responses,
        })
        break;

      case "new_response":
        responses = this.state.responses
        let i = responses.length
        responses.push(data.message)

        let result = responses[i].comment.match(/&gt;&gt;\d+/g)
        result?.map((v: string) => {
          return parseInt(v.replace("&gt;&gt;", "")) - 1
        }).forEach((v: number) => {
          if (responses[v].referenced === undefined) {
            responses[v].referenced = [i]
          } else {
            responses[v].referenced?.push(i)
          }
        })

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

    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl }).retrieveThread(this.props.match.params.id).then((res) => {
      this.setState({thread: res.data});
    })
  }


  sendResponse = () => {
    this.state.websocket.send(JSON.stringify({
      'type': 'new_response',
      'message': {
        'display_name': this.state.displayName,
        'comment': this.state.comment,
      },
    }));

    this.setState({
      comment: "",
      isOpenDialog: false,
    });
  }

  onReply = (i: number) => {
    this.setState({
      comment: ">>"+(i+1)+" ",
      isOpenDialog: true,
    });
  }

  componentWillUnmount = () => {
    this.state.websocket.close();
  }

  render() {
    return (
      <div className="thread-details">
        <Bar>
          <div>
            <Container id="responses" maxWidth="xl">
              <div>
                <h1>{ this.state.thread.title }</h1>
              </div>
              { this.state.responses.map((r, i) => (
                <Response
                  unread={ true }
                  i={ i }
                  responses={ this.state.responses }
                  nested={ 0 }
                  onReply={ this.onReply }
                />
              ))}
            </Container>

            <Button variant="outlined" color="primary" onClick={ () => {this.setState({isOpenDialog: true})} }>
              Open reply dialog
            </Button>
            <Dialog open={ this.state.isOpenDialog } onClose={ () => {this.setState({isOpenDialog: false})} } aria-labelledby="form-dialog-title">
              {/* <DialogTitle id="form-dialog-title">Reply</DialogTitle> */}
              <DialogContent>
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
                  rowsMax="10"
                  variant="outlined"
                  margin="dense"
                  value={ this.state.comment }
                  onChange={ (e) => this.setState({comment: e.target.value}) }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={ this.sendResponse } color="primary">
                  Reply
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Bar>
      </div>
    );
  }
}


export default ThreadDetails;
