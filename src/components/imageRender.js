import React, { Component } from "react";

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
        />
        <output>
          <ul id="list" />
        </output>
      </div>
    );
  }
}

export default ImageRender;
