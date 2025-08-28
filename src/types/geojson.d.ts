declare module '*.geojson' {
  const content: GeoJSON.FeatureCollection;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}
