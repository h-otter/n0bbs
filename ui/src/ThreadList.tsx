import React from 'react';
import { RouteComponentProps, Link } from "react-router-dom";
import { 
  Container,
  List,
  ListItem,
  ListItemText,
  Chip,
 } from '@material-ui/core';

import { DefaultApi, InlineResponse200Results } from './axios-client/api';



interface ThreadListPropsInterface extends RouteComponentProps<{ channel_id?: string }> {}

interface ThreadListStateInterface {
  threads?: InlineResponse200Results[];
}

class ThreadList extends React.Component<ThreadListPropsInterface, ThreadListStateInterface> {
  constructor(props: ThreadListPropsInterface) {
    super(props);

    this.state = {
      threads: [],
    };

    this.updateThreads(this.props.match.params.channel_id)
  }
  
  updateThreads = (channel_id: string | undefined) => {
    console.log(channel_id)
    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl })
      .listThreads(undefined, undefined, {params: {channels: channel_id}})
      .then((res) => {
        this.setState({threads: res.data.results});
    })
  }

  componentWillReceiveProps(props: ThreadListPropsInterface) {
    if (this.props.match.params.channel_id !== props.match.params.channel_id) {
      this.updateThreads(props.match.params.channel_id)
    }
  }

  render() {
    return (
      <div className="thread-list">
        <Container maxWidth="xl">
          <List>
            { this.state.threads?.map((t: InlineResponse200Results) => (
              <ListItem key={ "t"+t.id } button component={Link} to={ "/threads/"+t.id } style={{ paddingBottom: 0, paddingTop: 0 }}>
                <ListItemText
                  primary={ t.title }
                  secondary={ "@" + t.channel_name + " " + t.responses_count }
                  secondaryTypographyProps={{style: {fontSize: "0.75rem"}}}
                />
                { t.read_responses_count !== undefined && t.responses_count !== undefined && t.responses_count - t.read_responses_count > 0 && 
                  <Chip label={ ""+(t.responses_count - t.read_responses_count) } />
                }
              </ListItem>
            ))}
          </List>
        </Container>
      </div>
    );
  }
}


export default ThreadList;
