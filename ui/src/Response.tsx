import React from 'react';
import {
  Paper,
  IconButton,
  Typography,
  Link,
  Card,
  CardMedia,
  Grid,
} from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';

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
        <Paper id={ "r"+(this.props.i+1) } variant="outlined" square style={{margin: 'auto'}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption">
                <Link href={ "#r"+(this.props.i + 1) } color="inherit">
                  { this.props.i + 1 }.
                </Link> { this.props.responses[this.props.i].display_name } { this.props.responses[this.props.i].responded_at } id:{ this.props.responses[this.props.i].responded_by } <IconButton color="inherit" style={{padding: '0'}} onClick={ () => {this.props.onReply(this.props.i)} }><ReplyIcon style={{fontSize: '0.75rem'}} /></IconButton>
              </Typography>
              <Typography variant="body1" dangerouslySetInnerHTML={{
                __html: this.props.responses[this.props.i].comment
              }}></Typography>
            </Grid>
            { this.props.responses[this.props.i].images !== undefined &&
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={2}
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  { this.props.responses[this.props.i].images?.map((image, i) => (
                    <Grid key={ "image-"+this.props.i+"-"+i } item>
                      <Link href={ image }>
                        <Card>
                          <CardMedia
                            image={ image }
                            title={ image }
                            component="img"
                            style={{width: 120, height: 120}}
                            />
                        </Card>
                      </Link>
                    </Grid>
                  )) }
                </Grid>
              </Grid>
            }
          </Grid>
        </Paper>

        <div style={{marginLeft: "0.5rem"}}>
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
