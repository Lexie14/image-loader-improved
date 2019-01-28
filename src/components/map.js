import React, { Component } from "react";
import { Map, Marker } from "google-maps-react";

class GoogleMap extends Component {
  render() {
    // create map's borders based on the markers displayed
    let places = this.props.images.map(image => image.location);
    let bounds = new this.props.google.maps.LatLngBounds();

    for (var i = 0; i < places.length; i++) {
      // check if lat/lng are valid values
      if (!isNaN(places[i].lat)) {
        bounds.extend(places[i]);
      }
    }

    return (
      <div>
        <div className="mapContainer">
          <Map
            google={this.props.google}
            zoom={11}
            initialCenter={{ lat: 52.2566371, lng: 20.984122345 }}
            bounds={bounds}
          >
            {this.props.images.map(image => (
              <Marker key={image.id} id={image.id} position={image.location} />
            ))}
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleMap;
