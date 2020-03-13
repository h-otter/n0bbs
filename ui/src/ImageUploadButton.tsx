import React from 'react';
import {
  IconButton,
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import Cookies from 'js-cookie';

import { DefaultApi } from './axios-client/api';


interface ImageUploadButtonPropsInterface {
  onUpload: (url: string) => void;
}

interface ImageUploadButtonStateInterface {}

class ImageUploadButton extends React.Component<ImageUploadButtonPropsInterface, ImageUploadButtonStateInterface> {
  constructor(props: ImageUploadButtonPropsInterface) {
    super(props);

    this.state = {};

    this.uploadImage = this.uploadImage.bind(this)
  }

  uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    let files = e.target.files;
    if (files !== null) {
      let baseurl = window.location.protocol+"//"+window.location.host
      let api = new DefaultApi({ basePath: baseurl })

      for (let i = 0; i < files?.length; i++) {
        api.createImage(files?.item(i), {headers: {'X-CSRFToken': Cookies.get('csrftoken')}}).then((res) => {
          this.props.onUpload(res.data.image)
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
      </div>
    );
  }
}


export default ImageUploadButton;
