import React, { Component } from "react";

const image = require("../image.jpg");

class ImageRender extends Component {
  state = {};
  render() {
    return (
      <div className="App">
        <input
          type="file"
          id="files"
          name="files[]"
          multiple
          onChange={this.props.handleImageLoad}
          accept="image/*"
        />
        <output>
          <ul id="list" />
        </output>
      </div>
    );
  }
}

export default ImageRender;
