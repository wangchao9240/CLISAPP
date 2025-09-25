# CLISAPP MVP UI设计文档
> Queensland环境信息系统移动应用UI/UX设计规范

## 📋 文档概览
- **设计版本**: MVP 1.0 UI/UX
- **适用平台**: iOS 15+ / Android 9+
- **设计工具**: React Native + react-native-maps
- **设计原则**: Material Design 3 + iOS Human Interface Guidelines
- **创建时间**: 2025年9月17日

---

## 🎨 设计系统概览

### **品牌色彩体系**
```css
/* 主色调 - Queensland天空蓝 */
Primary Blue: #007AFF (iOS) / #2196F3 (Android)
Primary Dark: #0056B3
Primary Light: #42A5F5

/* 辅助色彩 */
Surface Light: #FFFFFF
Surface Dark: #F5F5F5
Background: #FAFAFA

/* 语义色彩 - 空气质量指示 */
Air Quality Good: #00E400
Air Quality Moderate: #FFFF00  
Air Quality Unhealthy: #FF7E00
Air Quality Very Unhealthy: #FF0000
Air Quality Hazardous: #8F3F97

/* 文字色彩 */
Text Primary: #212121
Text Secondary: #757575
Text Disabled: #BDBDBD
```

### **字体系统**
```css
/* iOS字体 */
Display Large: SF Pro Display, 32pt, Bold
Display Medium: SF Pro Display, 20pt, Semibold
Body Large: SF Pro Text, 16pt, Regular
Body Medium: SF Pro Text, 14pt, Regular
Caption: SF Pro Text, 12pt, Regular

/* Android字体 */
Display Large: Roboto, 32sp, Bold
Display Medium: Roboto, 20sp, Medium
Body Large: Roboto, 16sp, Regular
Body Medium: Roboto, 14sp, Regular
Caption: Roboto, 12sp, Regular
```

### **间距系统**
```css
/* 8pt Grid System */
Space XS: 4pt
Space S: 8pt
Space M: 16pt
Space L: 24pt
Space XL: 32pt
Space XXL: 48pt

/* 组件间距 */
Component Padding: 16pt
Section Margin: 24pt
Safe Area Padding: 16pt (iOS) / 16dp (Android)
```

### **阴影与圆角**
```css
/* 圆角 */
Border Radius Small: 8pt
Border Radius Medium: 12pt
Border Radius Large: 16pt

/* 阴影 - iOS */
Elevation 1: 0 2pt 4pt rgba(0,0,0,0.1)
Elevation 2: 0 4pt 8pt rgba(0,0,0,0.15)
Elevation 3: 0 8pt 16pt rgba(0,0,0,0.2)

/* Material Elevation - Android */
Elevation 1: 1dp
Elevation 2: 4dp  
Elevation 3: 8dp
```

---

## 📱 整体界面架构

### **应用架构层次**
```
CLISAPP架构
├── Splash Screen (启动屏)
├── Main Map Screen (主地图界面)
│   ├── Header (顶部搜索栏)
│   ├── Map Container (地图容器)
│   │   ├── Map View (地图视图)
│   │   ├── Boundary Overlays (边界覆盖层)
│   │   └── User Location (用户位置标记)
│   ├── Controls (地图控件)
│   │   ├── Layer Toggle (层级切换)
│   │   ├── Location Button (定位按钮)
│   │   └── Zoom Controls (缩放控件)
│   ├── Information Panel (信息面板)
│   │   └── Region Info Card (区域信息卡)
│   └── Bottom Sheet (底部操作面板)
│       └── Data Legend (数据图例)
└── Error/Loading States (错误/加载状态)
```

### **屏幕流程图**
```
[启动屏幕] 
    ↓ (2秒加载)
[主地图界面 - Queensland全图]
    ↓ (用户操作分支)
    ├── [搜索] → [搜索建议] → [飞行到目标]
    ├── [定位] → [权限请求] → [定位到当前位置]
    ├── [点击区域] → [信息卡弹出] → [数据展示]
    └── [层级切换] → [边界样式变更] → [缩放级别调整]
```

---

## 📂 UI文档组织结构

### **文档分类**
本文件夹包含以下UI设计文档：

#### **功能模块设计**
- [`FR-001-map-browsing.md`](./FR-001-map-browsing.md) - 地图浏览与缩放UI设计
- [`FR-002-layer-toggle.md`](./FR-002-layer-toggle.md) - 行政层级切换UI设计  
- [`FR-003-search-function.md`](./FR-003-search-function.md) - 区域搜索功能UI设计
- [`FR-004-info-panel.md`](./FR-004-info-panel.md) - 选区信息卡UI设计
- [`FR-005-location-service.md`](./FR-005-location-service.md) - GPS定位功能UI设计

#### **设计规范文档**
- [`design-system.md`](./design-system.md) - 完整设计系统规范
- [`component-library.md`](./component-library.md) - 可复用组件库
- [`responsive-design.md`](./responsive-design.md) - 响应式设计指南
- [`accessibility.md`](./accessibility.md) - 无障碍设计规范

#### **原型与资源**
- [`wireframes/`](./wireframes/) - 线框图和原型文件
- [`mockups/`](./mockups/) - 高保真视觉稿
- [`assets/`](./assets/) - 图标、插图等设计资源

---

## 🎯 设计目标与原则

### **核心设计目标**
1. **直观易用**: 新用户5分钟内掌握所有核心功能
2. **数据清晰**: 复杂的地理和环境数据以简单方式呈现
3. **性能优先**: 界面响应快速，动画流畅
4. **跨平台一致**: iOS和Android保持功能一致，遵循各自平台规范

### **设计原则**

#### **1. 信息层次清晰**
- 地图为主要视觉焦点，占屏幕80%以上
- 控件按使用频率分层显示
- 重要信息使用对比色突出显示

#### **2. 操作反馈及时**
- 所有交互提供即时视觉反馈
- 加载状态使用进度指示器
- 错误状态提供清晰的解决方案

#### **3. 认知负荷最小化**
- 一屏显示核心功能，避免深度导航
- 使用标准图标和手势
- 术语简单一致，避免技术jargon

#### **4. 包容性设计**
- 支持大字体和高对比度模式
- 色彩信息同时提供文字说明
- 触控区域≥44pt (iOS) / 48dp (Android)

---

## 📐 响应式设计策略

### **屏幕尺寸适配**

#### **手机端 (主要目标)**
- **紧凑屏幕** (4.7"): iPhone SE, 小屏Android
- **标准屏幕** (5.4"-6.1"): iPhone 12/13, 主流Android
- **大屏手机** (6.7"+): iPhone Pro Max, Android旗舰

#### **平板端 (次要支持)**
- **小平板** (7.9"-8.3"): iPad mini
- **标准平板** (9.7"-11"): iPad, Android平板

### **适配策略**
- **地图区域**: 始终占据最大可用空间
- **控件布局**: 小屏紧凑布局，大屏增加边距
- **文字大小**: 根据屏幕密度动态调整
- **触控区域**: 在小屏上优先保证可用性

---

## 🔧 技术实现考虑

### **React Native组件映射**
```javascript
// 主要UI组件技术实现
MapView: react-native-maps
Search: TextInput + FlatList  
Buttons: TouchableOpacity
Modals: Modal / BottomSheet
Animations: Animated API / react-native-reanimated
Icons: react-native-vector-icons
```

### **性能优化策略**
- **图片资源**: 使用WebP格式，提供多尺寸版本
- **动画**: 使用原生驱动的动画
- **列表渲染**: 搜索结果使用FlatList虚拟化
- **地图渲染**: 实现LOD和视口裁剪

### **可访问性实现**
```javascript
// 无障碍属性示例
<TouchableOpacity 
  accessible={true}
  accessibilityLabel="搜索区域"
  accessibilityHint="点击打开搜索功能"
  accessibilityRole="button"
>
```

---

## 📊 设计验证与测试

### **可用性测试计划**
1. **原型测试**: 使用Figma原型进行早期验证
2. **A/B测试**: 关键交互流程的多方案对比
3. **用户测试**: 5名目标用户的实际使用测试
4. **专家评审**: UX专家启发式评估

### **设计度量指标**
- **任务完成率**: >90%用户能完成核心任务
- **任务完成时间**: 查看区域信息<60秒
- **错误率**: 用户操作错误率<5%
- **满意度**: SUS得分>70分

### **迭代优化流程**
```
设计 → 原型 → 测试 → 反馈 → 优化 → 实现 → 验证
  ↑                                        ↓
  ←———————————— 持续改进循环 ——————————————→
```

---

## 📚 相关资源

### **设计参考**
- [Queensland Government Design System](https://www.designsystem.gov.au/)
- [Material Design 3](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [React Native Design Guidelines](https://reactnative.dev/docs/design)

### **工具与资源**
- **设计工具**: Figma (推荐), Sketch, Adobe XD
- **原型工具**: Figma Prototype, Principle, Framer
- **图标库**: Material Icons, SF Symbols, Custom Icons
- **插图**: Undraw, Humaaans, Custom Illustrations

---

**文档维护**: UX设计师 + 前端开发团队  
**更新周期**: 每Sprint设计评审后更新  
**版本**: 1.0 (MVP版本)
