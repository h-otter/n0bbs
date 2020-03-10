import React from 'react';
import { RouteComponentProps, Link } from "react-router-dom";
import { 
  Paper, TableContainer, TableHead, Table, TableRow, TableCell, TableBody, Container,
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
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>スレタイ</TableCell>
                    <TableCell align="right">レス数</TableCell>
                    <TableCell align="right">最終レス</TableCell>
                    {/* <TableCell align="right">未読</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  { this.state.threads?.map(t => (
                    <TableRow key={ t.id }>
                      {/* <TableRow key={ t.id } hover component="a" href={ ""+t.id }> */}
                      <TableCell component="th" scope="row">
                        <Link to={ "/threads/"+t.id }>
                          { t.responses_count > t.read_responses_count ? (
                            <strong>{ t.title }</strong>
                          ) : (
                            <>{ t.title }</>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{ t.responses_count }</TableCell>
                      <TableCell align="right">{ t.last_responded_at }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Bar>
      </div>
    );
  }
}


export default ListThreads;
