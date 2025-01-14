import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { PointType } from '../point/models/';
import PolygonModels, { PolygonModelType } from './models/';

interface IPolygonLayerStyleOptions {
  opacity: number;
}

export default class PolygonLayer extends BaseLayer<IPolygonLayerStyleOptions> {
  public type: string = 'PolygonLayer';
  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new PolygonModels[shape](this);
    this.models = this.layerModel.buildModels();
  }

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected getModelType(): PolygonModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as PolygonModelType;
    if (shape === 'fill') {
      return 'fill';
    } else if (shape === 'extrude') {
      return 'extrude';
    } else if (shape === 'line') {
      return 'line';
    } else {
      return this.getPointModelType();
    }
  }
  protected getPointModelType(): PolygonModelType {
    // pointlayer
    //  2D、 3d、 shape、image、text、normal、
    const layerData = this.getEncodedData();
    const { shape2d, shape3d } = this.getLayerConfig();
    const iconMap = this.iconService.getIconMap();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    if (!item) {
      return 'fill';
    } else {
      const shape = item.shape;
      if (shape === 'dot') {
        return 'point_normal';
      }
      if (shape2d?.indexOf(shape as string) !== -1) {
        return 'point_fill';
      }
      if (shape3d?.indexOf(shape as string) !== -1) {
        return 'point_extrude';
      }
      if (iconMap.hasOwnProperty(shape as string)) {
        return 'point_image';
      }
      return 'text';
    }
  }
}
