import React, { Component } from "react";
import ImageRender from "./components/imageRender";
import "./App.css";

class App extends Component {
  handleImageLoad(evt) {
    let files = evt.target.files;

    let li = document.createElement("li");

    for (let i = 0, f; (f = files[i]); i++) {
      if (!f.type.match("image.*")) {
        continue;
      }

      let reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          let span = document.createElement("span");
          span.innerHTML = [
            '<img class="thumb" src="',
            e.target.result,
            '" title="',
            escape(theFile.name),
            '"/>'
          ].join("");
          li.insertBefore(span, li.childNodes[0]);
        };
      })(f);

      reader.readAsDataURL(f);
    }
    let output = [];

    for (let i = 0; i < files.length; i++) {
      output.push(
        "<strong>",
        escape(files[0].name),
        "</strong> - ",
        files[0].size,
        " bytes"
      );
    }
    let p = document.createElement("p");
    p.innerHTML = output.join("");
    li.appendChild(p);
    document.getElementById("list").appendChild(li);
  }

  render() {
    return <ImageRender handleImageLoad={this.handleImageLoad} />;
  }
}

export default App;
