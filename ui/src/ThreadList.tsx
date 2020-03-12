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
import Bar from './Bar';



interface ThreadListPropsInterface extends RouteComponentProps<{}> {}

interface ThreadListStateInterface {
  threads?: InlineResponse200Results[];
}

class ThreadList extends React.Component<ThreadListPropsInterface, ThreadListStateInterface> {
  constructor(props: ThreadListPropsInterface) {
    super(props);

    this.state = {
      threads: [],
    };

    let baseurl = window.location.protocol+"//"+window.location.host
    new DefaultApi({ basePath: baseurl }).listThreads().then((res) => {
      this.setState({threads: res.data.results});
    })
  }

  render() {
    return (
      <div className="thread-list">
        <Bar>
          <Container maxWidth="xl">
            <List>
              { this.state.threads?.map((t: InlineResponse200Results) => (
                <ListItem key={ "t"+t.id } button component={Link} to={ "/threads/"+t.id } style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <ListItemText
                    primary={ t.title }
                    secondary={ t.responses_count !== undefined ? "" + t.responses_count : "0" }
                    secondaryTypographyProps={{style: {fontSize: "0.75rem"}}}
                  />
                  { t.read_responses_count !== undefined && t.responses_count !== undefined && t.responses_count - t.read_responses_count > 0 && 
                    <Chip label={ ""+(t.responses_count - t.read_responses_count) } />
                  }
                </ListItem>
              ))}
            </List>
          </Container>
        </Bar>
      </div>
    );
  }
}


export default ThreadList;
