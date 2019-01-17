import React, { Component } from "react";

const image = require("../image.jpg");

class ImageRender extends Component {
  state = {};
  render() {
    return (
      <div className="imageLoader">
        <div className="input">
          <input
            type="file"
            id="files"
            name="files[]"
            multiple
            onChange={this.props.handleImageLoad}
            accept="image/*"
          />
        </div>

        <output className="output">
          <ul id="list" />
        </output>
      </div>
    );
  }
}

export default ImageRender;
