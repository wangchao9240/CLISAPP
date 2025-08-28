import React from 'react';
import { View } from 'react-native';

export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default';

const MapView = (props) => {
  return React.createElement(View, props, props.children);
};

export const Marker = (props) => {
  return React.createElement(View, props, props.children);
};

export const Geojson = (props) => {
  return React.createElement(View, props, props.children);
};

export const AnimatedRegion = () => {};
export const Polygon = () => {};
export const Polyline = () => {};
export const Circle = () => {};
export const Overlay = () => {};
export const Heatmap = () => {};
export const Callout = () => {};

export default MapView;
