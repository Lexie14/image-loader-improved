import React, { Component } from "react";
import ImageRender from "./components/imageRender";
import GoogleMap from "./components/map";
import "./App.css";
import { FaCopyright } from "react-icons/fa";

const EXIF = require("exif-js");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      list: "wow"
    };
  }

  //
  handleImageLoad = evt => {
    var files = evt.target.files;

    // Handle error when there is no image upload
    // after input-onchange event fired
    if (files.length === 0) {
      return;
    }

    // Stop function execution if the image which is going
    // to be uploaded is already on the list
    for (let i = 0; i < this.state.images.length; i++) {
      if (files[0].name === this.state.images[i].id) {
        return;
      }
    }

    // Stop function exection if an image's size
    // exceeds 1Mb
    if (files[0].size > 1000000) {
      alert("The max size of an image must be less than 1Mb!");
      return;
    }

    this.getImageInfo(files);

    // Create a button to delete both:
    // image's record in the DOM and in the app's state
    // let btn = document.createElement("button");
    // let btnText = document.createTextNode("Delete");

    // btn.onclick = event => {
    //   this.deleteImage(event);
    // };

    // btn.appendChild(btnText);
    // li.appendChild(btn);
    // document.getElementById("list").appendChild(li);
    // this.getExifData(files);
  };

  // Get image's name and size on upload event
  getImageInfo = files => {
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      let li = document.createElement("li");
      li.innerHTML = `<p className=${files[i].name}>${
        files[i].name
      } - <span>Size: ${files[i].size}</span></p>`;

      let reader = new FileReader();
      reader.onload = event => {
        console.log(event);
        let image = document.createElement("img");
        image.setAttribute("src", `${event.target.result}`);
        image.id = `${files[i].name}`;
        li.insertBefore(image, li.childNodes[0]);
      };

      reader.readAsDataURL(files[i]);

      let list = document.getElementById("list");
      list.appendChild(li);
      // this.getExifData();
      // setTimeout(() => {
      //   this.getExifData();
      // }, 100);
    }
  };

  some() {
    console.log("hey");
  }
  // Delete image from the DOM and in the app's state
  deleteImage = event => {
    let liId = event.path[1].id;
    let id = liId.substring(2);
    let liDel = document.getElementById("li" + id);
    liDel.parentNode.removeChild(liDel);
    console.log(id);
    let imagesList = this.state.images;
    let newImagesList = [];

    for (let i = 0; i < imagesList.length; i++) {
      if (imagesList[i].id !== id) {
        newImagesList.push(imagesList[i]);
      }
    }
    this.setState({ images: newImagesList });
    document.getElementById("files").value = "";
  };

  // Get lat and lng data data via Exif
  getExifData = files => {
    let lng, lat;

    // setTimeout is used to make sure that an image
    // has been already uploaded and the info from it
    // can be extracted by Exif

    let img1 = document.getElementById(files[0].name);
    EXIF.getData(img1, function() {
      let longitude = EXIF.getTag(this, "GPSLongitude");
      let latitude = EXIF.getTag(this, "GPSLatitude");

      if (longitude) {
        lng =
          longitude[0].numerator +
          longitude[1].numerator / (60 * longitude[1].denominator) +
          longitude[2].numerator / (3600 * longitude[2].denominator);
      } else {
        lng = "no data available";
      }

      if (latitude) {
        lat =
          latitude[0].numerator +
          latitude[1].numerator / (60 * latitude[1].denominator) +
          latitude[2].numerator / (3600 * latitude[2].denominator);
      } else {
        lat = "no data available";
      }

      let p = document.createElement("p");
      p.innerHTML = " Longitude: " + lng + ", Latitude: " + lat;
      document.getElementById("img" + files[0].name).appendChild(p);
      return lat, lng;
    });
    console.log(lat, lng);

    // Image's lng and lat are added to the app's state
    // in order to use it for GoogleMaps markers location
    let newImage = { id: files[0].name, location: { lat: lat, lng: lng } };
    this.setState({ images: this.state.images.concat(newImage) });
  };

  render() {
    return (
      <div className="App">
        <header>Image Uploader</header>
        <div className="content">
          <ImageRender handleImageLoad={this.handleImageLoad} />
          <GoogleMap google={window.google} images={this.state.images} />
        </div>
        <footer>
          <p>
            <span className="copyright">
              <FaCopyright />
            </span>
            2019 made by Lexie for Be Poland Think, Solve & Execute
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
