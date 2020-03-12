import React from 'react';
import { Paper, IconButton, Typography } from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';

import './Response.css';
import ResponseInstance from './ResponseInstance';



interface ResponsePropsInterface {
  responses: ResponseInstance[];
  i: number;
  nested: number;

  onReply: (i: number) => void;
}

interface ResponsepropsInterface {
}

class Response extends React.Component<ResponsePropsInterface, ResponsepropsInterface> {
  constructor(props: ResponsePropsInterface) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="response">
        <Paper id={ "r"+(this.props.i+1) } variant="outlined" square>
          <Typography variant="caption">
            <a href={ "#r"+(this.props.i + 1) }>{ this.props.i + 1 }.</a> { this.props.responses[this.props.i].display_name } { this.props.responses[this.props.i].responded_at } id:{ this.props.responses[this.props.i].responded_by } <IconButton color="inherit" style={{padding: '0'}} onClick={ () => {this.props.onReply(this.props.i)} }><ReplyIcon style={{fontSize: '0.75rem'}} /></IconButton>
          </Typography>
          <Typography variant="body1" dangerouslySetInnerHTML={{
            __html: this.props.responses[this.props.i].comment
          }}></Typography>
        </Paper>

        <div className="child-responses">
          { this.props.responses[this.props.i].referenced?.map((r) => (
            <Response
              key={ ""+(this.props.i)+"-"+r }
              i={ r } 
              responses={ this.props.responses } 
              nested={ this.props.nested + 1 } 
              onReply={ this.props.onReply }
            />
          )) }
        </div>
      </div>
    );
  }
}


export default Response;
