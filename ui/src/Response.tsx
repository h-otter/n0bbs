import React from 'react';
import { Paper } from '@material-ui/core';
import * as emojione from 'emojione';

import './Response.css';
import ResponseInstance from './ResponseInstance';



interface ResponsePropsInterface {
  responses: ResponseInstance[];
  i: number;
  unread: boolean;

  isChild?: boolean;
}

interface ResponsepropsInterface {
}

class Response extends React.Component<ResponsePropsInterface, ResponsepropsInterface> {
  constructor(props: ResponsePropsInterface) {
    super(props);

    this.state = {};
  }

  renderComment() {
    let comment = this.props.responses[this.props.i].comment;

    // break lines
    comment = comment.replace(/\r?\n/g, "<br>");
    // urlize
    comment = comment.replace(/(http[s]?:\/\/.*)[\s\r\n]*/g, '<a href="$1">$1</a>');
    // anchor to >>1
    comment = comment.replace(/&gt;&gt;(\d+)/g, '<a href="#r$1">&gt;&gt;$1</a>');
    comment = emojione.toImage(comment);

    return <p dangerouslySetInnerHTML={{
      __html: comment
    }}></p>
  }

  render() {
    return (
      <div className="response">
        <Paper id={ this.props.isChild !== undefined && this.props.isChild ? "" : "r"+(this.props.i+1) } variant="outlined" square>
          <p>
            <a href={ "#r"+(this.props.i + 1) }>{ this.props.i + 1 }.</a> { this.props.responses[this.props.i].display_name } { this.props.responses[this.props.i].responded_at } id:{ this.props.responses[this.props.i].responded_by }
          </p>
          { this.renderComment() }
        </Paper>

        <div className="child-responses">
          { this.props.responses[this.props.i].referenced?.map((r) => (
            <Response unread={ this.props.unread } i={ r } responses={ this.props.responses } isChild={ true } />
          )) }
        </div>
      </div>
    );
  }
}


export default Response;
