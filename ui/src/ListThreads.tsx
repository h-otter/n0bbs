import React from 'react';
import { RouteComponentProps, Link } from "react-router-dom";
import { 
  Paper, TableContainer, TableHead, Table, TableRow, TableCell, TableBody, Container,
  List,
  ListItem,
  ListItemText,
 } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { DefaultApi, InlineResponse200Results } from './axios-client/api';
import Bar from './Bar';



interface ListThreadsPropsInterface extends RouteComponentProps<{}> {}

interface ListThreadsStateInterface {
  threads?: InlineResponse200Results[];
}

class ListThreads extends React.Component<ListThreadsPropsInterface, ListThreadsStateInterface> {
  constructor(props: ListThreadsPropsInterface) {
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
      <div className="thread-details">
        <Bar>
          <Container maxWidth="xl">
            <List>
              { this.state.threads?.map((t: InlineResponse200Results) => (
                <ListItem button component={Link} to={ "/threads/"+t.id }>
                  <ListItemText primary={ t.title } secondary={ t.read_responses_count !== undefined && t.responses_count !== undefined ? "" + (t.responses_count - t.read_responses_count) + " / " + t.responses_count + " " + t.last_responded_at : "" } />
                </ListItem>
              ))}
            </List>
          </Container>
        </Bar>
      </div>
    );
  }
}


export default ListThreads;
