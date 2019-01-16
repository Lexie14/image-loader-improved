import React, { Component } from "react";
import { Map, Marker } from "google-maps-react";

class GoogleMap extends Component {
  state = {};
  render() {
    const style = { width: "70%", height: "70%" };
    let places = this.props.images.map(image => image.location);
    let bounds = new this.props.google.maps.LatLngBounds();

    for (var i = 0; i < places.length; i++) {
      if (places[i].lat !== "no data available") {
        bounds.extend(places[i]);
      }
    }

    return (
      <div>
        <p>hi-hi-hi</p>
        <div className="gMap">
          <Map
            style={style}
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