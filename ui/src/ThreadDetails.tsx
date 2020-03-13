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
import * as emojione from 'emojione';

import "./ThreadDetails.css";
import Response from './Response';
import ResponseInstance from './ResponseInstance';
import { DefaultApi, InlineResponse200Results } from './axios-client/api';
import Bar from './Bar';
import ImageUploadButton from './ImageUploadButton'


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

      let responses: ResponseInstance[] = []
      switch (data.type) {
      case "all_responses":
        responses = data.message.responses
        responses.forEach((res, i) => {
          responses = this.initializeResponseInstance(responses, i)
        })

        this.setState({
          responses: responses,
        })
        break;

      case "new_response":
        responses = this.state.responses
        let i = responses.length
        responses.push(data.message)

        this.setState({
          responses: this.initializeResponseInstance(responses, i),
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

    this.sendResponse = this.sendResponse.bind(this)
    this.onReply = this.onReply.bind(this)
    this.handleChangeDisplayName = this.handleChangeDisplayName.bind(this)
    this.handleChangeComment = this.handleChangeComment.bind(this)
    this.openDialog = this.openDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.onUpload = this.onUpload.bind(this)

    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl }).retrieveThread(this.props.match.params.id).then((res) => {
      this.setState({thread: res.data});
    })
  }

  componentWillUnmount() {
    this.state.websocket.close();
  }

  sendResponse() {
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

  // TODO: 要高速化
  // WARNING: <a> タグではなく <Link> タグを使う -> classだけとりあえず真似ることにした
  renderComment(comment: string) {
    // urlize
    comment = comment.replace(/(http[s]?:\/\/[^\s\r\n]*)/g, '<a href="$1" class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorInherit">$1</a>');
    // anchor to >>1
    comment = comment.replace(/&gt;&gt;(\d+)/g, '<a href="#r$1" class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorInherit">&gt;&gt;$1</a>');
    // break lines
    comment = comment.replace(/\r?\n/g, "<br>");
    comment = emojione.toImage(comment);

    return comment
  }

  initializeResponseInstance(responses: ResponseInstance[], i: number) {
    let result = responses[i].comment.match(/&gt;&gt;\d+/g)
    responses[i].parents = result?.map((v: string) => {
      return parseInt(v.replace("&gt;&gt;", "")) - 1
    })
    responses[i].parents?.forEach((v: number) => {
      if (responses[v].referenced === undefined) {
        responses[v].referenced = [i]
      } else {
        responses[v].referenced?.push(i)
      }
    })

    let r = responses[i].comment.match(/http[s]?:\/\/[^\s\r\n]*\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG|webp)/g)
    if (r !== null) {
      responses[i].images = r
    }
    responses[i].comment = this.renderComment(responses[i].comment)

    return responses
  }

  onReply(i: number) {
    this.setState({
      comment: ">>"+(i+1)+" ",
      isOpenDialog: true,
    });
  }

  handleChangeDisplayName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({displayName: e.target.value});
  }
  handleChangeComment(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({comment: e.target.value});
  }
  openDialog() {
    this.setState({isOpenDialog: true});
  }
  closeDialog() {
    this.setState({isOpenDialog: false});
  }
  handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.sendResponse()
    }
  }
  onUpload(url: string) {
    let comment = this.state.comment
    comment += "\n"+url

    this.setState({comment: comment})
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
                (r.parents === undefined || r.parents?.length === 0) && <Response
                  key={ i }
                  i={ i }
                  responses={ this.state.responses }
                  nested={ 0 }
                  onReply={ this.onReply }
                />
              ))}
              <Button
                variant="outlined"
                onClick={ this.openDialog }
                fullWidth
              >
                Reply
              </Button>
            </Container>

            <Dialog open={ this.state.isOpenDialog } onClose={ this.closeDialog } aria-labelledby="form-dialog-title">
              {/* <DialogTitle id="form-dialog-title">Reply</DialogTitle> */}
              <DialogContent>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Display Name"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  value={ this.state.displayName }
                  onChange={ this.handleChangeDisplayName }
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
                  onChange={ this.handleChangeComment }
                  onKeyDown={ this.handleKeyDown }
                />
                <ImageUploadButton onUpload={ this.onUpload } />
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
