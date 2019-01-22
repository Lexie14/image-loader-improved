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
    for (let i = 0; i < files.length; i++) {
      let li = document.createElement("li");
      li.innerHTML = `<p id=${files[i].name}>${files[i].name} - <span>Size: ${
        files[i].size
      }</span></p>`;

      let reader = new FileReader();
      let image;
      reader.onload = event => {
        image = document.createElement("img");
        image.setAttribute("src", `${event.target.result}`);
        image.className = `${files[i].name}`;
        li.insertBefore(image, li.childNodes[0]);

        image.onload = () => {
          this.getExifData(files, i, image, li);
        };
      };

      reader.readAsDataURL(files[i]);

      let list = document.getElementById("list");
      list.appendChild(li);
    }
  };

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
  getExifData(files, i, image, li) {
    let location = [];

    EXIF.getData(image, () => {
      let longitude = EXIF.getTag(image, "GPSLongitude");
      let latitude = EXIF.getTag(image, "GPSLatitude");
      location.push(longitude, latitude);

      for (let i = 0; i < location.length; i++) {
        if (location[i]) {
          location[i] =
            location[i][0].numerator +
            location[i][1].numerator / (60 * location[i][1].denominator) +
            location[i][2].numerator / (3600 * location[i][2].denominator);
        } else {
          location[i] = "no data  available";
        }
      }
    });

    let locationInfo = document.createElement("p");
    locationInfo.innerText = `Location: Longitude - ${location[0]},
    Latitude - ${location[1]}`;
    let toAppend = document.getElementById(files[i].name);
    toAppend.appendChild(locationInfo);
  }

  // Image's lng and lat are added to the app's state
  // in order to use it for GoogleMaps markers location
  // let newImage = { id: files[0].name, location: { lat: lat, lng: lng } };
  // this.setState({ images: this.state.images.concat(newImage) });
  // };

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
