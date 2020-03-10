import React from 'react';
import { Paper } from '@material-ui/core';
import * as emojione from 'emojione';

import './Response.css';
import ResponseInstance from './ResponseInstance';



interface ResponsePropsInterface {
  responses: ResponseInstance[];
  i: number;
  unread: boolean;
}

interface ResponsepropsInterface {
}

class Response extends React.Component<ResponsePropsInterface, ResponsepropsInterface> {
  constructor(props: ResponsePropsInterface) {
    super(props);

    this.state = {};
    // console.log(props)
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

  renderAnchoredComment() {
    if (!this.props.unread) {
      return
    }

    let list: any[] = [];

    // >> か &gt;&gt;かが微妙
    let result = this.props.responses[this.props.i].comment.match(/&gt;&gt;\d+/g)
    result?.forEach((anchor) => {
      let child = parseInt(anchor.replace("&gt;&gt;", "")) - 1
      if (this.props.i > child) {
        list.push(<Response unread={ this.props.unread } i={ child } responses={ this.props.responses } />)
      }
    })

    return <div className="child-responses">{ list }</div>
  }

  render() {
    return (
      <div className="response">
        <Paper id={ "r"+(this.props.i+1) } variant="outlined" square>
          <p>{ this.props.i + 1 }. { this.props.responses[this.props.i].display_name } { this.props.responses[this.props.i].responded_at } id:{ this.props.responses[this.props.i].responded_by }</p>
          { this.renderComment() }
        </Paper>
        { this.renderAnchoredComment() }
      </div>
    );
  }
}


export default Response;
