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
      images: []
    };
  }

  // Sequence of actions on image upload event
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
  };

  // Get image's name, size and thumbnail
  getImageInfo = files => {
    // Get images' name and size
    for (let i = 0; i < files.length; i++) {
      let li = document.createElement("li");
      li.id = "li" + files[i].name;
      li.innerHTML = `<p id = ${files[i].name}>${files[i].name} - <span>Size: ${
        files[i].size
      }</span></p>`;

      // Get image's thumbnail
      let reader = new FileReader();
      let image;
      reader.onload = event => {
        image = document.createElement("img");
        image.setAttribute("src", `${event.target.result}`);
        li.insertBefore(image, li.childNodes[0]);

        image.onload = () => {
          this.getExifData(files, i, image, li);
        };
      };

      reader.readAsDataURL(files[i]);

      // Create Delete button
      let btn = document.createElement("button");
      btn.id = "btn" + files[i].name;
      let btnText = document.createTextNode("Delete");
      let app = this;

      btn.onclick = function() {
        let liState = this.id.substring(3);
        app.deleteImage(liState);
      };

      btn.appendChild(btnText);
      li.appendChild(btn);
      let list = document.getElementById("list");
      list.appendChild(li);
    }
  };

  // Get lat and lng data data via Exif
  getExifData(files, i, image, li) {
    let location = [];

    EXIF.getData(image, () => {
      let latitude = EXIF.getTag(image, "GPSLatitude");
      let longitude = EXIF.getTag(image, "GPSLongitude");
      location.push(latitude, longitude);

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
    locationInfo.innerText = `Location: Latitude - ${location[0]},
    Longitude - ${location[1]}`;
    let toAppend = document.getElementById(files[i].name);
    toAppend.appendChild(locationInfo);

    // Image's id, lng and lat are added to the app's state
    // in order to use it for the Delete button and
    // GoogleMaps markers location
    let newImage = {
      id: files[i].name,
      location: { lat: location[0], lng: location[1] }
    };
    this.setState({ images: this.state.images.concat(newImage) });
  }

  // Delete image's record in the DOM and in the app's state
  deleteImage = liState => {
    // setTimeout is used to make sure the function will be
    // based on the latest updated state (imagesList)
    setTimeout(() => {
      // Delete image from the images list in the App's state
      let imagesList = this.state.images;
      let newImagesList = [];

      for (let i = 0; i < imagesList.length; i++) {
        if (imagesList[i].id !== liState) {
          newImagesList.push(imagesList[i]);
        }
      }

      this.setState({
        images: newImagesList
      });

      // Delete image from the images list in the App's DOM
      let liList = "li" + liState;
      let liToDelete = document.getElementById(liList);
      liToDelete.parentNode.removeChild(liToDelete);
      document.getElementById("files").value = "";
    }, 100);
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
