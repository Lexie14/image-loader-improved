import React, { Component } from "react";
import ImageRender from "./components/imageRender";
import "./App.css";

const EXIF = require("exif-js");

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   images: []
    // };

    this.handleImageLoad = this.handleImageLoad.bind(this);
  }

  handleImageLoad(evt) {
    var files = evt.target.files;

    let li = document.createElement("li");
    li.id = "li" + files[0].name;

    for (let i = 0, f; (f = files[i]); i++) {
      if (!f.type.match("image.*")) {
        continue;
      }

      let reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          let span = document.createElement("span");
          span.innerHTML = [
            '<img id="',
            escape(theFile.name),
            '"src="',
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
        "</strong> - Size: ",
        files[0].size,
        " bytes. "
      );
    }
    let p = document.createElement("p");
    p.id = "img" + files[0].name;
    p.innerHTML = output.join("");
    li.insertBefore(p, li.childNodes[1]);

    let btn = document.createElement("button");
    var btnText = document.createTextNode("Delete");
    btn.onclick = function() {
      let liDel = document.getElementById("li" + files[0].name);
      liDel.parentNode.removeChild(liDel);
    };

    btn.appendChild(btnText);
    li.appendChild(btn);
    document.getElementById("list").appendChild(li);
    this.getData(files);

    // this.getData(evt.target);
  }

  getData = files => {
    setTimeout(() => {
      let img1 = document.getElementById(files[0].name);
      EXIF.getData(img1, function() {
        let longitude = EXIF.getTag(this, "GPSLongitude");
        let latitude = EXIF.getTag(this, "GPSLatitude");
        let lng =
          longitude[0].numerator +
          longitude[1].numerator / (60 * longitude[1].denominator) +
          longitude[2].numerator / (3600 * longitude[2].denominator);

        let lat =
          latitude[0].numerator +
          latitude[1].numerator / (60 * latitude[1].denominator) +
          latitude[2].numerator / (3600 * latitude[2].denominator);

        let p = document.createElement("p");
        p.innerHTML = " Longitude: " + lng + ", Latitude: " + lat;
        document.getElementById("img" + files[0].name).appendChild(p);
      });
      console.log(files[0].name);
    }, 100);
  };

  render() {
    return <ImageRender handleImageLoad={this.handleImageLoad} />;
  }
}

export default App;
