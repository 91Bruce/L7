import { LineLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class LineDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://arcgis.github.io/arcgis-samples-javascript/sample-data/custom-gl-animated-lines/lines.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [-74.006, 40.7128],
        zoom: 11.5,
        style: 'dark',
      }),
    });
    const lineLayer = new LineLayer({
      minZoom: 12,
      maxZoom: 15,
    })
      .source(await response.json(), {
        parser: {
          type: 'json',
          coordinates: 'path',
        },
      })
      .size(3)
      .shape('line')
      .active(true)
      .color('color', (v) => {
        return `rgb(${v})`;
      })
      .animate({
        enable: true,
        interval: 0.5,
        trailLength: 0.4,
        duration: 4,
      })
      .style({
        opacity: 1.0,
      });

    lineLayer.on('click', (e) => {
      console.log(e);
    });
    scene.addLayer(lineLayer);
    this.scene = scene;
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
