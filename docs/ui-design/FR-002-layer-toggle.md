# FR-002: 行政层级切换 UI设计文档
> LGA与Suburb/Locality双层级边界切换界面设计

## 📋 功能概览
- **功能ID**: FR-002
- **优先级**: 🔴 Must Have
- **复杂度**: 中等
- **涉及平台**: iOS + Android
- **依赖**: FR-001 (地图浏览)

## 🎯 设计目标

### **核心目标**
1. **层级理解**: 帮助用户理解LGA和Suburb的行政层级概念
2. **快速切换**: 提供直观的切换控件，响应时间≤1秒
3. **状态清晰**: 用户始终知道当前查看的是哪个层级
4. **视觉区分**: 不同层级有明显的视觉差异

### **用户价值**
- 获得不同精度的行政区域信息
- 根据需求选择合适的数据粒度
- 理解Queensland的行政区域结构

---

## 📱 界面布局设计

### **层级切换控件位置**
```
┌─────────────────────────────────────┐
│ 🔍 Search Queensland...        ☰ │
├─────────────────────────────────────┤
│                               ┌───┐ │ ← Layer Toggle Widget
│                               │LGA│ │   (Top Right, 16pt margin)
│              MAP VIEW          │SUB│ │   Fixed Position
│                               └───┘ │
│                                     │
│                              ┌─┐   │
│                              │📍│   │
│                              └─┘   │
└─────────────────────────────────────┘
```

### **层级切换控件详细设计**

#### **方案A: 分段控件 (推荐)**
```
┌─────────────────┐
│  LGA  │  SUB   │ ← Segmented Control
└─────────────────┘
   ↑active  inactive

尺寸: 120pt × 32pt
圆角: 16pt (全圆角)
背景: rgba(255,255,255,0.9) + 2pt阴影
字体: 14pt, Medium
```

**状态设计**:
```css
/* 激活状态 */
Active Tab:
  Background: #007AFF (Primary Blue)
  Text Color: #FFFFFF
  Animation: 0.3s ease-out切换

/* 非激活状态 */
Inactive Tab:
  Background: Transparent
  Text Color: #007AFF
  Border: 1pt solid #007AFF
```

#### **方案B: 切换按钮 (备选)**
```
┌─────────────┐
│ LGA    ⇄   │ ← Toggle Button with icon
└─────────────┘

当前层级: LGA (大字体)
切换指示: 双箭头图标
点击行为: 直接切换到另一层级
```

#### **方案C: 下拉选择器 (备选)**
```
┌─────────────┐
│ LGA     ▼  │ ← Dropdown selector
├─────────────┤
│ LGA         │
│ Suburb      │
└─────────────┘
```

### **控件状态指示器**
```
┌─────────────────┐
│  LGA  │  SUB   │
└─────────────────┘
      ↓
┌─────────────────┐  ← 当前层级指示
│ Showing: LGA    │  
│ 77 regions      │  ← 当前可见区域数量
└─────────────────┘
```

---

## 🎨 视觉设计规范

### **层级样式差异化**

#### **LGA层级视觉样式**
```css
/* 边界样式 */
Boundary Style:
  Stroke Color: #1976D2 (Deep Blue)
  Stroke Width: 3pt (较粗，表示高层级)
  Fill Color: rgba(25, 118, 210, 0.15)
  Dash Pattern: Solid
  
/* 标签样式 */
Label Style:
  Font Size: 16pt (较大)
  Font Weight: Semibold
  Color: #1976D2
  Background: rgba(255,255,255,0.8)
  Padding: 8pt
  Border Radius: 4pt
  
/* 选中高亮 */
Selected Style:
  Stroke Color: #FF6600 (Orange)
  Stroke Width: 4pt
  Fill Color: rgba(255, 102, 0, 0.25)
  Glow Effect: 0 0 8pt rgba(255, 102, 0, 0.5)
```

#### **Suburb层级视觉样式**
```css
/* 边界样式 */
Boundary Style:
  Stroke Color: #42A5F5 (Light Blue)
  Stroke Width: 2pt (较细，表示低层级)
  Fill Color: rgba(66, 165, 245, 0.08)
  Dash Pattern: Solid
  
/* 标签样式 */
Label Style:
  Font Size: 14pt (较小)
  Font Weight: Regular
  Color: #42A5F5
  Background: rgba(255,255,255,0.7)
  Padding: 6pt
  Border Radius: 3pt
  
/* 选中高亮 */
Selected Style:
  Stroke Color: #FF6600 (Orange)
  Stroke Width: 3pt
  Fill Color: rgba(255, 102, 0, 0.2)
  Glow Effect: 0 0 6pt rgba(255, 102, 0, 0.4)
```

### **切换动画设计**
```javascript
// 层级切换动画时序
Layer Switch Animation: {
  Duration: 0.8s total
  
  Phase 1 (0-0.2s): 当前边界淡出
    Opacity: 1.0 → 0.3
    
  Phase 2 (0.2s-0.4s): 样式转换准备
    Boundaries: 重新计算和处理
    
  Phase 3 (0.4s-0.8s): 新边界淡入
    Opacity: 0.0 → 1.0
    Stroke animation: 边界线条逐步绘制
    
  Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
}
```

---

## 🔄 交互流程设计

### **层级切换完整流程**

#### **Step 1: 用户触发切换**
```
用户操作: 点击切换控件 (LGA → Suburb)
即时反馈: 
  - 控件状态动画 (0.2s)
  - 显示加载指示器
  - 禁用重复点击
```

#### **Step 2: 数据处理阶段**
```
系统处理:
  - 根据当前视口计算需要的边界数据
  - 检查数据缓存
  - 加载或生成Suburb边界
  
用户看到:
  - 地图顶部的细微进度条
  - 切换控件显示"加载中"状态
  
最大等待时间: 1秒
```

#### **Step 3: 视觉更新**
```
视觉变化:
  - LGA边界逐渐淡出 (0.3s)
  - Suburb边界淡入显示 (0.5s)
  - 标签文字更新
  - 图例更新对应说明
  
用户感知:
  - 地图细节层次明显增加
  - 可以看到更小的行政区划
```

#### **Step 4: 状态确认**
```
完成指示:
  - 切换控件显示新的激活状态
  - 底部状态栏更新: "Showing: Suburb (245 regions)"
  - 移除所有加载指示器
  
交互恢复:
  - 重新启用用户交互
  - 支持后续的地图操作
```

### **错误处理流程**
```
错误情况: Suburb数据加载失败
处理方案:
  1. 保持当前LGA状态
  2. 显示友好错误提示: "Suburb data temporarily unavailable"
  3. 提供重试选项
  4. 记录错误用于后续优化
  
错误UI:
┌─────────────────┐
│ ⚠️ Data Loading │
│ Please retry    │
│ [Retry] [Cancel]│
└─────────────────┘
```

---

## 📐 响应式适配

### **不同屏幕尺寸的控件适配**

#### **紧凑屏幕 (≤5.4")**
```css
Layer Toggle:
  Size: 100pt × 28pt (较小)
  Font Size: 12pt
  Position: Top Right, 12pt margin
  
Labels on Map:
  LGA: 14pt
  Suburb: 12pt (最小可读大小)
```

#### **标准屏幕 (5.4"-6.7")**
```css
Layer Toggle:
  Size: 120pt × 32pt (标准)
  Font Size: 14pt
  Position: Top Right, 16pt margin
  
Labels on Map:
  LGA: 16pt
  Suburb: 14pt
```

#### **大屏设备 (≥6.7")**
```css
Layer Toggle:
  Size: 140pt × 36pt (较大)
  Font Size: 16pt
  Position: Top Right, 20pt margin
  
Labels on Map:
  LGA: 18pt
  Suburb: 16pt
```

### **横屏模式优化**
```
横屏布局:
┌───────────────────────────────────────────────────────────┐
│ 🔍 Search...          ┌─────────────────┐         ☰ │   │
│                       │  LGA  │  SUB   │           📍│   │
├───────────────────────└─────────────────┘─────────────────┤
│                                                           │
│                    EXPANDED MAP VIEW                      │
│                                                           │
└───────────────────────────────────────────────────────────┘

优势: 更大的地图区域，更好的层级比较体验
控件位置: 居中偏上，不遮挡地图主要内容
```

---

## 🔧 技术实现指南

### **React Native组件结构**
```javascript
<LayerToggleWidget>
  <SegmentedControl
    values={['LGA', 'Suburb']}
    selectedIndex={currentLayerIndex}
    onChange={handleLayerChange}
    style={layerToggleStyles.container}
    fontStyle={layerToggleStyles.text}
    activeFontStyle={layerToggleStyles.activeText}
    backgroundColor="rgba(255,255,255,0.9)"
    tintColor="#007AFF"
  />
  
  {isLoading && (
    <LoadingIndicator 
      style={layerToggleStyles.loadingOverlay}
      size="small"
      color="#007AFF"
    />
  )}
  
  <LayerStatus
    currentLayer={currentLayer}
    regionCount={visibleRegionCount}
    style={layerToggleStyles.status}
  />
</LayerToggleWidget>
```

### **状态管理**
```javascript
// Layer state management
const [layerState, setLayerState] = useState({
  currentLayer: 'LGA', // 'LGA' | 'Suburb'
  isTransitioning: false,
  loadingProgress: 0,
  error: null,
  visibleRegions: []
});

// Layer switching logic
const handleLayerSwitch = useCallback(async (targetLayer) => {
  if (layerState.isTransitioning) return; // 防止重复点击
  
  setLayerState(prev => ({
    ...prev,
    isTransitioning: true,
    loadingProgress: 0
  }));
  
  try {
    // 1. 准备数据
    const boundaryData = await loadBoundaryData(targetLayer, currentViewport);
    
    // 2. 更新地图显示
    await updateMapBoundaries(boundaryData, {
      animationDuration: 800,
      onProgress: (progress) => {
        setLayerState(prev => ({
          ...prev,
          loadingProgress: progress
        }));
      }
    });
    
    // 3. 完成切换
    setLayerState(prev => ({
      ...prev,
      currentLayer: targetLayer,
      isTransitioning: false,
      visibleRegions: boundaryData
    }));
    
  } catch (error) {
    setLayerState(prev => ({
      ...prev,
      isTransitioning: false,
      error: error.message
    }));
  }
}, [currentViewport]);
```

### **性能优化策略**
```javascript
// 1. 边界数据预加载
const useLayerPreloading = () => {
  useEffect(() => {
    // 在LGA层级时预加载Suburb数据
    if (currentLayer === 'LGA' && currentZoom > 10) {
      preloadSuburbData(currentViewport);
    }
  }, [currentLayer, currentZoom, currentViewport]);
};

// 2. 视口相关的数据过滤
const getRelevantBoundaries = useMemo(() => {
  return boundaries.filter(boundary => 
    isWithinViewport(boundary.bounds, viewport) &&
    meetsMinimumSize(boundary, viewport.zoom)
  );
}, [boundaries, viewport]);

// 3. 动画优化
const useOptimizedLayerAnimation = () => {
  return useCallback((fromLayer, toLayer) => {
    // 在低端设备上简化动画
    const isLowEndDevice = DeviceInfo.isLowEndDevice();
    const animationConfig = {
      duration: isLowEndDevice ? 400 : 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad)
    };
    
    return Animated.sequence([
      // 淡出当前层级
      Animated.timing(currentLayerOpacity, {
        toValue: 0,
        ...animationConfig
      }),
      // 淡入新层级
      Animated.timing(newLayerOpacity, {
        toValue: 1,
        ...animationConfig
      })
    ]);
  }, []);
};
```

---

## 🧪 用户测试与验证

### **A/B测试计划**

#### **控件样式测试**
```
方案A: 分段控件 (当前推荐)
  - 视觉: 标准iOS/Android分段控件
  - 优势: 用户熟悉，清晰表示状态
  
方案B: 切换按钮
  - 视觉: 单个按钮显示当前层级
  - 优势: 节省空间，简洁

测试指标:
  - 功能发现率: 用户能否快速找到切换功能
  - 操作成功率: 切换操作的成功完成率
  - 理解度: 用户是否理解当前查看的层级
  - 满意度: 主观使用体验评分
```

#### **切换动画测试**
```
方案A: 快速切换 (0.4s)
方案B: 标准切换 (0.8s)
方案C: 慢速切换 (1.2s)

测试指标:
  - 等待感知: 用户觉得等待时间是否合理
  - 视觉理解: 能否清楚看到变化过程
  - 操作频率: 用户切换层级的频率变化
```

### **可用性测试场景**

#### **场景1: 首次使用层级切换**
```
测试目标: 验证新用户能否理解和使用层级切换功能
前置条件: 用户已熟悉基本地图操作

测试步骤:
1. 要求用户找到控制地图详细程度的功能
2. 观察用户如何发现层级切换控件
3. 让用户尝试在LGA和Suburb间切换
4. 询问用户对两个层级差异的理解

成功标准:
- 90%用户能在30秒内找到切换控件
- 85%用户能正确理解LGA和Suburb的区别
- 用户主观满意度≥4/5分
```

#### **场景2: 任务导向的层级使用**
```
测试任务: "请找到Brisbane市Sunnybank区域的详细边界"
预期行为:
1. 用户搜索或导航到Brisbane区域
2. 发现需要更详细的边界信息
3. 主动切换到Suburb层级
4. 找到并选择Sunnybank

观察重点:
- 用户是否主动想到切换层级
- 切换操作是否流畅
- 对结果是否满意
```

---

## 📊 性能指标与优化

### **关键性能指标**
```javascript
const layerToggleMetrics = {
  // 响应时间
  toggleResponseTime: 300, // 控件响应时间(ms) - 目标<500ms
  dataLoadTime: 800, // 数据加载时间(ms) - 目标<1000ms
  animationDuration: 800, // 动画持续时间(ms)
  totalSwitchTime: 1100, // 总切换时间(ms) - 目标<1500ms
  
  // 用户行为
  switchFrequency: 0.8, // 每会话切换次数
  layerPreference: 'LGA', // 用户偏好层级
  errorRate: 0.02, // 切换错误率 - 目标<0.05
  
  // 技术性能
  memoryIncrease: 15, // 切换时内存增长(MB) - 目标<30MB
  cacheHitRate: 0.85, // 缓存命中率 - 目标>0.8
  renderingLatency: 200 // 渲染延迟(ms) - 目标<300ms
};
```

### **优化策略**
```javascript
// 1. 智能预加载
const useSmartPreloading = () => {
  useEffect(() => {
    const userBehavior = getUserBehaviorPattern();
    
    // 根据用户习惯预加载数据
    if (userBehavior.likelyToSwitchToSuburb > 0.7) {
      preloadSuburbData(currentViewport);
    }
  }, [userBehavior]);
};

// 2. 渐进式加载
const useProgressiveLoading = () => {
  return useCallback(async (targetLayer) => {
    // 先加载关键边界
    const essentialBoundaries = await loadEssentialBoundaries(targetLayer);
    updateMapDisplay(essentialBoundaries);
    
    // 后续加载详细数据
    const detailedBoundaries = await loadDetailedBoundaries(targetLayer);
    updateMapDisplay([...essentialBoundaries, ...detailedBoundaries]);
  }, []);
};

// 3. 内存管理
const useMemoryOptimization = () => {
  useEffect(() => {
    // 清理非活跃层级的数据
    const cleanup = () => {
      if (currentLayer === 'LGA') {
        releaseSuburbMemory();
      } else {
        releaseLGAMemory();
      }
    };
    
    const timeoutId = setTimeout(cleanup, 30000); // 30秒后清理
    return () => clearTimeout(timeoutId);
  }, [currentLayer]);
};
```

---

## 🔄 迭代优化计划

### **MVP版本 (Week 9-10)**
- [ ] 实现基础分段控件
- [ ] LGA/Suburb数据切换
- [ ] 基本切换动画
- [ ] 错误状态处理

### **优化版本1 (Week 11)**
- [ ] 性能优化和预加载
- [ ] 改进动画效果
- [ ] 用户行为分析集成
- [ ] A/B测试数据收集

### **优化版本2 (Week 12)**
- [ ] 基于测试结果的UI优化
- [ ] 响应式设计完善
- [ ] 无障碍功能增强
- [ ] 跨平台一致性验证

### **最终版本 (Week 13)**
- [ ] 用户反馈整合
- [ ] 性能基准达标验证
- [ ] 生产环境准备
- [ ] 文档和培训材料

---

**设计负责人**: UX Designer + 地图可视化专家  
**技术实现**: Frontend团队 + 地图集成工程师  
**用户验证**: UX研究员 + Queensland本地用户  
**文档版本**: 1.0 (MVP)
