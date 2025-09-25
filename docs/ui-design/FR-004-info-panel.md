# FR-004: 选区信息卡 UI设计文档
> 区域详细信息展示和数据回退界面设计

## 📋 功能概览
- **功能ID**: FR-004
- **优先级**: 🔴 Must Have
- **复杂度**: 高
- **涉及平台**: iOS + Android
- **核心交互**: 区域选择、信息展示、数据回退处理

## 🎯 设计目标

### **核心目标**
1. **信息清晰**: 复杂的区域数据以直观方式呈现
2. **快速理解**: 用户能在10秒内理解区域环境状况
3. **数据透明**: 明确展示数据来源、时效性和可靠性
4. **智能回退**: 数据缺失时提供有意义的替代信息

### **用户价值**
- 获得区域的全面环境和基础信息
- 理解数据质量和来源可信度
- 支持基于数据的区域选择决策

---

## 📱 界面布局设计

### **信息卡整体布局**
```
┌─────────────────────────────────────┐
│              MAP VIEW               │
│                                     │
│ ┌─ Selected Region Highlight ──────┐ │
│ │                                 │ │
│ │        Sunnybank Hills          │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤ ← Info Panel Divider
│ 📍 Sunnybank Hills            × │ ← Panel Header (48pt)
│ Suburb • Queensland                 │
├─────────────────────────────────────┤
│ 🌬️ Air Quality                     │ ← Primary Data Section
│ PM2.5: 15 μg/m³ [Good] 💚          │   (Auto height)
│ Safe for outdoor activities        │
├─────────────────────────────────────┤
│ 👥 Population: 8,247 (ABS 2021)    │ ← Secondary Data Section
│ 📮 Postcode: 4109                  │   (Compact layout)
├─────────────────────────────────────┤
│ ℹ️ Data Sources & Notes             │ ← Metadata Section
│ • Air quality: EPA QLD (Sep 2024)  │   (Collapsible)
│ • Population: ABS Census 2021      │
│ • Using Suburb-level data          │
└─────────────────────────────────────┘
```

### **信息卡出现行为**

#### **触发方式**
```
Method 1: 直接点击区域边界
Method 2: 点击搜索结果后自动显示
Method 3: 定位到当前位置后显示
Method 4: 长按地图任意位置 (选择最近区域)
```

#### **显示动画**
```javascript
// 信息卡出现动画序列
const infoPanelAnimation = {
  // Phase 1: 区域高亮 (0-200ms)
  regionHighlight: {
    strokeWidth: [2, 4],
    strokeColor: ['#1976D2', '#FF6600'],
    fillOpacity: [0.1, 0.25],
    duration: 200
  },
  
  // Phase 2: 面板滑入 (200-500ms)
  panelSlideIn: {
    translateY: [300, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 300,
    easing: 'ease-out'
  },
  
  // Phase 3: 内容淡入 (400-700ms)
  contentFadeIn: {
    opacity: [0, 1],
    translateY: [20, 0],
    stagger: 100, // 每节内容延迟100ms
    duration: 300
  }
};
```

---

## 🎨 信息卡详细设计

### **头部区域 (Header Section)**
```css
Header Container:
  Height: 48pt
  Background: #FFFFFF
  Border Bottom: 1pt solid #E0E0E0
  Padding: 12pt horizontal
  
Region Name:
  Font: 18pt, Semibold
  Color: #212121
  Position: Left aligned
  Truncation: ... if exceeds width
  
Region Type Badge:
  Background: #E3F2FD (Light Blue)
  Color: #1976D2
  Font: 12pt, Medium
  Padding: 4pt 8pt
  Border Radius: 12pt
  Position: Below name, left aligned
  
Close Button:
  Size: 32pt × 32pt
  Icon: × (24pt)
  Color: #757575
  Position: Top right
  Touch Area: 44pt × 44pt (extended)
```

#### **区域类型标识设计**
```
LGA Badge:
  Background: #E8F5E8
  Color: #2E7D32
  Text: "LGA • Queensland"
  
Suburb Badge:
  Background: #E3F2FD
  Color: #1976D2
  Text: "Suburb • Queensland"
  
City Badge:
  Background: #FFF3E0
  Color: #F57C00
  Text: "City • Queensland"
```

### **主要数据区域 (Primary Data Section)**
```css
Section Container:
  Padding: 16pt
  Background: #FFFFFF
  Border Bottom: 1pt solid #F0F0F0
  
Air Quality Display:
  Layout: Horizontal
  
Icon:
  Size: 24pt × 24pt
  Color: Contextual (based on air quality level)
  Position: Left
  
Data Layout:
┌─────────────────────────────────────┐
│ 🌬️ Air Quality                     │
│                                     │
│    15 μg/m³                        │ ← Large number (32pt, Bold)
│    PM2.5 • Good                    │ ← Units + Status (16pt, Medium)
│                                     │
│ 💚 Safe for outdoor activities     │ ← Health advice (14pt, Regular)
│                                     │
│ WHO Guidelines: 0-15 μg/m³ (Good)   │ ← Reference info (12pt, Secondary)
└─────────────────────────────────────┘
```

#### **空气质量状态设计**
```css
/* 状态颜色编码 */
Good (0-15): 
  Background: #E8F5E8
  Border: #4CAF50
  Icon: 💚
  
Moderate (16-35):
  Background: #FFF8E1
  Border: #FF9800
  Icon: 🟡
  
Unhealthy for Sensitive (36-55):
  Background: #FFF3E0
  Border: #FF5722
  Icon: 🟠
  
Unhealthy (56-150):
  Background: #FFEBEE
  Border: #F44336
  Icon: 🔴
  
Very Unhealthy (151-250):
  Background: #F3E5F5
  Border: #9C27B0
  Icon: 🟣
  
Hazardous (250+):
  Background: #EFEBE9
  Border: #795548
  Icon: 🟤
```

### **次要数据区域 (Secondary Data Section)**
```css
Section Container:
  Padding: 12pt 16pt
  Background: #FAFAFA
  
Data Item Layout:
  Height: 32pt
  Layout: Horizontal
  
Icon + Text Pattern:
┌─────────────────────────────────────┐
│ 👥 Population: 8,247 (ABS 2021)    │
│ 📮 Postcode: 4109                  │
│ 📏 Area: 12.4 km² (Approx.)        │
│ 🏛️ Council: Brisbane City Council   │ ← 仅LGA显示
└─────────────────────────────────────┘

Typography:
  Icon: 16pt
  Label: 14pt, Medium
  Value: 14pt, Regular
  Source: 12pt, Secondary color
```

### **元数据区域 (Metadata Section)**
```css
Section Container:
  Padding: 12pt 16pt
  Background: #F5F5F5
  
Collapsible Header:
  Height: 36pt
  Icon: ℹ️ (16pt)
  Text: "Data Sources & Notes" (14pt, Medium)
  Chevron: ▼/▲ (12pt)
  
Expanded Content:
┌─────────────────────────────────────┐
│ ℹ️ Data Sources & Notes        ▲   │
│                                     │
│ Air Quality Data:                   │
│ • Source: EPA Queensland            │
│ • Updated: September 2024           │
│ • Resolution: Suburb-level          │
│                                     │
│ Population Data:                    │
│ • Source: Australian Bureau Stats  │
│ • Census: 2021                      │
│ • Resolution: SA2 Statistical Area │
│                                     │
│ ⚠️ Note: Air quality data estimated │
│    from nearest monitoring station │
│    (2.1 km away)                   │
└─────────────────────────────────────┘
```

---

## 🔄 数据回退处理设计

### **数据可用性层级**

#### **Level 1: 完整Suburb数据**
```
显示状态: 正常显示
数据质量指示: 绿色圆点 🟢
说明文字: "Using Suburb-level data"
置信度: 高
```

#### **Level 2: LGA数据回退**
```
显示状态: 标注说明的LGA数据
数据质量指示: 黄色圆点 🟡
说明文字: "Using LGA data (Suburb data unavailable)"
置信度: 中等

视觉处理:
- 数值显示：正常
- 添加警告图标：⚠️
- 背景色略微变暗：#FFF9C4
```

#### **Level 3: 估算数据**
```
显示状态: 基于邻近区域的估算
数据质量指示: 橙色圆点 🟠
说明文字: "Estimated from nearby regions"
置信度: 低

视觉处理:
- 数值显示：斜体字
- 添加估算标识：~ (约)
- 明确标注：(Estimated)
```

#### **Level 4: 无数据**
```
显示状态: 友好的无数据提示
数据质量指示: 灰色圆点 ⚪
说明文字: "Data temporarily unavailable"

替代内容:
┌─────────────────────────────────────┐
│ 🌬️ Air Quality                     │
│                                     │
│ Data Not Available                  │
│                                     │
│ 📍 Try nearby areas:               │
│ • Brisbane City (LGA)              │
│ • Surrounding suburbs              │
│                                     │
│ 🔄 Check again later               │
└─────────────────────────────────────┘
```

### **数据质量指示器设计**
```css
Quality Indicator:
  Size: 8pt diameter
  Position: Next to section title
  Animation: None (static)
  
Tooltip on Press:
  Background: rgba(0,0,0,0.8)
  Color: #FFFFFF
  Font: 12pt, Regular
  Padding: 8pt
  Border Radius: 8pt
  Max Width: 200pt
  
Quality Levels:
  🟢 High: "Current suburb-level data"
  🟡 Medium: "LGA-level data used"
  🟠 Low: "Estimated from nearby areas"
  ⚪ None: "Data currently unavailable"
```

---

## 📐 响应式适配设计

### **不同屏幕尺寸适配**

#### **紧凑屏幕 (≤5.4")**
```css
Info Panel:
  Max Height: 60% screen height
  Header Height: 44pt
  Section Padding: 12pt
  
Primary Data:
  Value Font: 28pt (较小)
  Status Font: 14pt
  Layout: Compact vertical
  
Secondary Data:
  Item Height: 28pt
  Font Size: 13pt
  Hide less important items
```

#### **标准屏幕 (5.4"-6.7")**
```css
Info Panel:
  Max Height: 65% screen height
  Header Height: 48pt
  Section Padding: 16pt
  
Primary Data:
  Value Font: 32pt (标准)
  Status Font: 16pt
  Layout: Standard
  
Secondary Data:
  Item Height: 32pt
  Font Size: 14pt
  Show all standard items
```

#### **大屏设备 (≥6.7")**
```css
Info Panel:
  Max Height: 70% screen height
  Header Height: 52pt
  Section Padding: 20pt
  Additional side margins: 16pt
  
Primary Data:
  Value Font: 36pt (较大)
  Status Font: 18pt
  Layout: Spacious
  
Secondary Data:
  Item Height: 36pt
  Font Size: 15pt
  Show extended information
```

### **横屏模式优化**
```
横屏信息卡布局:
┌───────────────────────────────────────────────────────────┐
│                        MAP VIEW                           │
│                                                           │
│  ┌─────────────────────────────┐  ┌─────────────────────┐ │
│  │     Selected Region         │  │   Info Panel        │ │
│  │                             │  │ ┌─────────────────┐ │ │
│  │                             │  │ │ 📍 Sunnybank    │ │ │
│  │                             │  │ │ Suburb          │ │ │
│  │                             │  │ ├─────────────────┤ │ │
│  │                             │  │ │ 🌬️ Air Quality  │ │ │
│  │                             │  │ │ 15 μg/m³ [Good] │ │ │
│  │                             │  │ ├─────────────────┤ │ │
│  │                             │  │ │ 👥 Pop: 8,247   │ │ │
│  │                             │  │ │ 📮 Code: 4109   │ │ │
│  │                             │  │ └─────────────────┘ │ │
│  └─────────────────────────────┘  └─────────────────────┘ │
└───────────────────────────────────────────────────────────┘

特点:
- 信息面板固定在右侧，不遮挡地图
- 面板宽度: 300pt (固定)
- 内容布局更紧凑
- 支持滚动查看更多信息
```

---

## 🔧 技术实现指南

### **React Native组件结构**
```javascript
<InfoPanel
  selectedRegion={selectedRegion}
  onClose={handleClosePanel}
  style={infoPanelStyles.container}
>
  <PanelHeader
    regionName={selectedRegion.name}
    regionType={selectedRegion.type}
    onClose={handleClosePanel}
  />
  
  <ScrollView style={infoPanelStyles.content}>
    <PrimaryDataSection>
      <AirQualityDisplay
        pm25Value={airQualityData.pm25}
        status={airQualityData.status}
        healthAdvice={airQualityData.healthAdvice}
        dataQuality={airQualityData.quality}
      />
    </PrimaryDataSection>
    
    <SecondaryDataSection>
      <DataItem
        icon="👥"
        label="Population"
        value={regionData.population}
        source={regionData.populationSource}
      />
      <DataItem
        icon="📮"
        label="Postcode"
        value={regionData.postcode}
      />
      <DataItem
        icon="📏"
        label="Area"
        value={regionData.area}
      />
      {regionData.type === 'suburb' && (
        <DataItem
          icon="🏛️"
          label="Council"
          value={regionData.council}
        />
      )}
    </SecondaryDataSection>
    
    <MetadataSection
      sources={regionData.sources}
      notes={regionData.notes}
      isCollapsed={metadataCollapsed}
      onToggle={() => setMetadataCollapsed(!metadataCollapsed)}
    />
  </ScrollView>
</InfoPanel>
```

### **数据回退逻辑实现**
```javascript
// 数据回退服务
class DataFallbackService {
  async getRegionData(regionId, regionType) {
    const fallbackChain = [
      () => this.getSuburbLevelData(regionId),
      () => this.getLGALevelData(regionId),
      () => this.getEstimatedData(regionId),
      () => this.getDefaultNoDataResponse()
    ];
    
    for (const [index, fallbackMethod] of fallbackChain.entries()) {
      try {
        const data = await fallbackMethod();
        
        if (data && this.isValidData(data)) {
          return {
            ...data,
            dataQuality: this.getQualityLevel(index),
            fallbackLevel: index,
            qualityIndicator: this.getQualityIndicator(index)
          };
        }
      } catch (error) {
        console.warn(`Fallback level ${index} failed:`, error);
        continue;
      }
    }
    
    throw new Error('All data sources failed');
  }
  
  getQualityLevel(fallbackLevel) {
    const levels = ['high', 'medium', 'low', 'none'];
    return levels[fallbackLevel] || 'none';
  }
  
  getQualityIndicator(fallbackLevel) {
    const indicators = ['🟢', '🟡', '🟠', '⚪'];
    return indicators[fallbackLevel] || '⚪';
  }
  
  async getEstimatedData(regionId) {
    // 基于邻近区域估算数据
    const nearbyRegions = await this.getNearbyRegions(regionId, 10); // 10km半径
    const validData = nearbyRegions.filter(region => region.hasValidData);
    
    if (validData.length === 0) return null;
    
    // 距离加权平均
    const weightedAverage = this.calculateWeightedAverage(validData);
    
    return {
      ...weightedAverage,
      isEstimated: true,
      estimationSource: `${validData.length} nearby regions`,
      confidence: this.calculateConfidence(validData)
    };
  }
}
```

### **性能优化实现**
```javascript
// 信息面板性能优化
const useOptimizedInfoPanel = (selectedRegion) => {
  // 1. 数据预加载
  useEffect(() => {
    if (selectedRegion) {
      // 预加载邻近区域数据用于潜在的回退
      preloadNearbyRegionData(selectedRegion.id);
    }
  }, [selectedRegion]);
  
  // 2. 智能缓存
  const cachedData = useMemo(() => {
    return cache.get(selectedRegion?.id);
  }, [selectedRegion?.id]);
  
  // 3. 渐进式数据加载
  const [dataState, setDataState] = useState({
    basic: null,      // 基础信息 (立即显示)
    detailed: null,   // 详细信息 (延迟加载)
    metadata: null    // 元数据 (按需加载)
  });
  
  const loadDataProgressively = useCallback(async (regionId) => {
    // 立即显示基础信息
    const basicData = await getBasicRegionData(regionId);
    setDataState(prev => ({ ...prev, basic: basicData }));
    
    // 延迟加载详细信息
    setTimeout(async () => {
      const detailedData = await getDetailedRegionData(regionId);
      setDataState(prev => ({ ...prev, detailed: detailedData }));
    }, 100);
    
    // 按需加载元数据
    if (userExpandedMetadata) {
      const metadata = await getRegionMetadata(regionId);
      setDataState(prev => ({ ...prev, metadata }));
    }
  }, [userExpandedMetadata]);
  
  return { dataState, loadDataProgressively };
};
```

---

## 🧪 用户测试与验证

### **信息理解度测试**

#### **测试场景1: 数据理解任务**
```
测试目标: 验证用户能否正确理解显示的环境数据
测试内容: 显示Brisbane某区域的信息卡

测试问题:
1. "这个区域的空气质量如何？"
2. "今天适合户外运动吗？"
3. "这些数据有多可靠？"
4. "人口数据来自什么时间？"

成功标准:
- 90%用户能正确理解空气质量状况
- 85%用户能理解健康建议
- 75%用户能识别数据来源信息
- 80%用户满意数据的详细程度
```

#### **测试场景2: 数据回退理解**
```
测试设置: 显示使用LGA数据回退的Suburb信息
测试目标: 验证用户能否理解数据回退机制

测试问题:
1. "为什么显示的是LGA数据？"
2. "你如何看待这个数据的可靠性？"
3. "你会基于这个信息做决定吗？"

观察重点:
- 回退说明的可发现性
- 数据质量指示器的理解度
- 对估算数据的接受程度
```

### **A/B测试计划**

#### **信息面板大小测试**
```
方案A: 50%屏幕高度 (紧凑)
方案B: 65%屏幕高度 (标准)
方案C: 80%屏幕高度 (详细)

测试指标:
- 信息完整性感知
- 地图可见性满意度
- 操作便利性评分
- 数据查看完成率
```

#### **数据优先级测试**
```
方案A: 空气质量 → 人口 → 其他
方案B: 空气质量 → 其他 → 人口
方案C: 人口 → 空气质量 → 其他

测试指标:
- 用户关注点分析
- 信息获取效率
- 任务完成满意度
```

---

## 📊 性能监控指标

### **关键性能指标**
```javascript
const infoPanelMetrics = {
  // 响应性能
  panelDisplayTime: 300, // 面板显示时间(ms) - 目标<500ms
  dataLoadingTime: 800, // 数据加载时间(ms) - 目标<1000ms
  scrollPerformance: 60, // 滚动帧率(FPS) - 目标≥60FPS
  
  // 数据质量
  dataAvailabilityRate: 0.95, // 数据可用率 - 目标>0.9
  fallbackUsageRate: 0.15, // 回退使用率 - 目标<0.2
  estimationAccuracy: 0.85, // 估算准确性 - 目标>0.8
  
  // 用户行为
  panelViewDuration: 45, // 平均查看时长(秒)
  metadataExpansionRate: 0.3, // 元数据展开率
  dataSourceClickRate: 0.1, // 数据源点击率
  
  // 技术性能
  memoryUsage: 20, // 内存使用(MB) - 目标<40MB
  renderingLatency: 150, // 渲染延迟(ms) - 目标<200ms
  cacheEfficiency: 0.8 // 缓存效率 - 目标>0.7
};
```

---

## 🔄 迭代优化计划

### **MVP版本 (Week 9-10)**
- [ ] 基础信息面板和数据展示
- [ ] LGA/Suburb数据回退逻辑
- [ ] 空气质量数据可视化
- [ ] 基本的数据来源标注

### **优化版本1 (Week 11)**
- [ ] 改进的动画和交互效果
- [ ] 数据质量指示器完善
- [ ] 响应式设计优化
- [ ] 性能监控集成

### **优化版本2 (Week 12)**
- [ ] 高级数据可视化 (图表、趋势)
- [ ] 个性化数据显示偏好
- [ ] 无障碍功能增强
- [ ] 错误处理优化

### **最终版本 (Week 13)**
- [ ] 基于用户测试的UI优化
- [ ] 数据准确性验证和改进
- [ ] 生产环境性能调优
- [ ] 完整的文档和说明

---

**设计负责人**: UX Designer + 数据可视化专家  
**技术实现**: Frontend团队 + 数据处理工程师  
**数据专家**: GIS分析师 + 环境数据专家  
**用户验证**: UX研究员 + Queensland居民测试组  
**文档版本**: 1.0 (MVP)
