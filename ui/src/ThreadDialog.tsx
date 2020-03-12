import React from 'react';
import {
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  FormControlLabel,
 } from '@material-ui/core';
import Cookies from 'js-cookie';

import Response from './Response';
import ResponseInstance from './ResponseInstance';
import { DefaultApi, InlineObject } from './axios-client/api';
import Bar from './Bar';


interface ThreadDialogPropsInterface {
  open: boolean;
  onClose: () => void;
}

interface ThreadDialogStateInterface extends InlineObject {
  displayName: string;
  comment: string;
}

class ThreadDialog extends React.Component<ThreadDialogPropsInterface, ThreadDialogStateInterface> {
  constructor(props: ThreadDialogPropsInterface) {
    super(props);

    this.state = {
      title: "",
      anonymous: false,
      responses: [],
      displayName: "n0nameさん",
      comment: "",
    };

    this.createThread = this.createThread.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.toggleAnonymous = this.toggleAnonymous.bind(this)
    this.handleChangeDisplayName = this.handleChangeDisplayName.bind(this)
    this.handleChangeComment = this.handleChangeComment.bind(this)
  }
  
  createThread() {
    let request: InlineObject = {
      ...this.state,
      responses: [{
        display_name: this.state.displayName,
        comment: this.state.comment,
      }],
    }

    console.log(this.state)

    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl }).createThread(request, {headers: {'X-CSRFToken': Cookies.get('csrftoken')}}).then((res) => {
      console.log(res);

      this.setState({
        title: "",
        anonymous: false,
        responses: [],
        displayName: "n0nameさん",
        comment: "",
      });
  
      this.props.onClose()
    }).catch((err) => {
      console.log(err)
    })
  }


  handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({title: e.target.value});
  }
  toggleAnonymous() {
    this.setState({anonymous: !this.state.anonymous});
  }
  handleChangeDisplayName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({displayName: e.target.value});
  }
  handleChangeComment(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({comment: e.target.value});
  }


  render() {
    return (
      <div className="thread-dialog">
        <Dialog open={ this.props.open } onClose={ this.props.onClose } aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">New Thread</DialogTitle>
          <DialogContent>
            <TextField
              id="outlined-multiline-flexible"
              label="Title"
              fullWidth
              variant="outlined"
              margin="dense"
              value={ this.state.title }
              onChange={ this.handleChangeTitle }
            />
            <FormControlLabel control={<Switch value={ this.state.anonymous } onChange={ this.toggleAnonymous } />} label="Anonymous" />
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
              fullWidth
              multiline
              rowsMax="10"
              variant="outlined"
              margin="dense"
              value={ this.state.comment }
              onChange={ this.handleChangeComment }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ this.createThread } color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


export default ThreadDialog;
