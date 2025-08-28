const fs = require('fs');
const path = require('path');

// 读取原始GeoJSON文件
console.log('Reading original GeoJSON file...');
const originalData = JSON.parse(fs.readFileSync('./src/assets/geodata/geodata.json', 'utf8'));

console.log(`Original file has ${originalData.features.length} features`);

// 简化几何图形并保留重要属性
const simplifiedFeatures = originalData.features.map((feature, index) => {
  // 保留重要属性
  const simplifiedProperties = {
    LGA_NAME25: feature.properties.LGA_NAME25,
    pm25_value_mean: feature.properties.pm25_value_mean,
  };

  // 简化几何图形 - 保留更少的坐标点
  let simplifiedGeometry = feature.geometry;
  
  if (feature.geometry.type === 'Polygon') {
    simplifiedGeometry = {
      type: 'Polygon',
      coordinates: feature.geometry.coordinates.map(ring => {
        // 每隔几个点取一个坐标，但保留关键点
        const step = Math.max(1, Math.floor(ring.length / 50)); // 最多保留50个点
        return ring.filter((_, i) => i % step === 0 || i === ring.length - 1);
      })
    };
  } else if (feature.geometry.type === 'MultiPolygon') {
    simplifiedGeometry = {
      type: 'MultiPolygon',
      coordinates: feature.geometry.coordinates.map(polygon =>
        polygon.map(ring => {
          const step = Math.max(1, Math.floor(ring.length / 50));
          return ring.filter((_, i) => i % step === 0 || i === ring.length - 1);
        })
      )
    };
  }

  return {
    type: 'Feature',
    properties: simplifiedProperties,
    geometry: simplifiedGeometry
  };
});

// 创建简化的GeoJSON
const simplifiedData = {
  type: 'FeatureCollection',
  features: simplifiedFeatures
};

// 保存简化版本
const outputPath = './src/assets/geodata/geodata_optimized.json';
fs.writeFileSync(outputPath, JSON.stringify(simplifiedData));

console.log(`Simplified GeoJSON saved to ${outputPath}`);
console.log(`Reduced from ${originalData.features.length} to ${simplifiedFeatures.length} features`);

// 检查文件大小
const originalSize = fs.statSync('./src/assets/geodata/geodata.json').size;
const optimizedSize = fs.statSync(outputPath).size;

console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Size reduction: ${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`);
