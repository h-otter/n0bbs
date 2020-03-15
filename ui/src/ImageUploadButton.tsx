import React from 'react';
import {
  Backdrop,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import Cookies from 'js-cookie';

import { DefaultApi } from './axios-client/api';


interface ImageUploadButtonPropsInterface {
  onUpload: (url: string) => void;
}

interface ImageUploadButtonStateInterface {
  uploading: number;
}

class ImageUploadButton extends React.Component<ImageUploadButtonPropsInterface, ImageUploadButtonStateInterface> {
  constructor(props: ImageUploadButtonPropsInterface) {
    super(props);
    
    this.state = {
      uploading: 0,
    };
    
    this.uploadImage = this.uploadImage.bind(this)
  }

  uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    let files = e.target.files;
    if (files !== null) {
      let baseurl = window.location.protocol+"//"+window.location.host
      let api = new DefaultApi({ basePath: baseurl })

      let uploading = files?.length;
      this.setState({uploading: uploading})

      for (let i = 0; i < files?.length; i++) {
        api.createImage(files?.item(i), {headers: {'X-CSRFToken': Cookies.get('csrftoken')}}).then((res) => {
          this.props.onUpload(res.data.image)

          uploading--;
          this.setState({uploading: uploading})
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }

  render() {
    return (
      <div className="image-upload-button">
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={ this.uploadImage }
        />
        <label htmlFor="image-upload">
          <IconButton color="inherit" component="span">
            <ImageIcon />
          </IconButton>
        </label>

        <Backdrop style={{zIndex: 100}} open={ this.state.uploading != 0 }>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}


export default ImageUploadButton;
