# FR-005: GPS定位功能 UI设计文档
> 用户位置获取和定位服务界面设计

## 📋 功能概览
- **功能ID**: FR-005
- **优先级**: 🟡 Should Have
- **复杂度**: 中等
- **涉及平台**: iOS + Android
- **核心交互**: 位置权限、GPS定位、地图跳转

## 🎯 设计目标

### **核心目标**
1. **便捷定位**: 一键快速定位到用户当前位置
2. **权限友好**: 清晰解释位置权限的用途和好处
3. **错误处理**: 优雅处理定位失败和权限拒绝
4. **隐私保护**: 明确用户位置数据的使用范围

### **用户价值**
- 快速了解当前所在区域的环境信息
- 避免手动搜索当前位置
- 提供本地化的区域信息体验

---

## 📱 界面布局设计

### **定位按钮位置设计**
```
┌─────────────────────────────────────┐
│ 🔍 Search Queensland...        ☰ │
├─────────────────────────────────────┤
│                                     │
│              MAP VIEW               │
│                                     │
│  ┌─┐ ← Layer Toggle                 │
│  │L│   (Top Right)                  │
│  └─┘                               │
│                                     │
│                              ┌─┐   │ ← Location Button
│                              │📍│   │   (Bottom Right)
│                              └─┘   │   Fixed Position
│ ┌─────────────────────────────────┐ │
│ │        Air Quality Legend       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **定位按钮详细设计**

#### **默认状态 (Inactive)**
```css
Location Button:
  Size: 48pt × 48pt
  Background: rgba(255,255,255,0.95)
  Border: 1pt solid rgba(0,0,0,0.1)
  Border Radius: 24pt (圆形)
  Shadow: 0 2pt 8pt rgba(0,0,0,0.15)
  Position: Bottom Right, 16pt margin from edges
  
Icon:
  Name: "location-arrow" or "my-location"
  Size: 24pt × 24pt
  Color: #757575 (Secondary gray)
  
Touch Area:
  Size: 48pt × 48pt (meets accessibility standards)
  Feedback: Scale 0.95 on press
```

#### **激活状态 (Active/Loading)**
```css
Location Button:
  Background: #007AFF (Primary blue)
  Border: 1pt solid #0056B3
  Shadow: 0 4pt 12pt rgba(0,122,255,0.3)
  
Icon:
  Color: #FFFFFF
  Animation: Rotating spinner or pulsing effect
  Duration: 1s infinite
  
Loading Indicator:
  Style: Circular progress around button edge
  Color: #FFFFFF
  Width: 2pt
```

#### **已定位状态 (Located)**
```css
Location Button:
  Background: #34C759 (Success green)
  Border: 1pt solid #28A745
  
Icon:
  Name: "location-pin-filled"
  Color: #FFFFFF
  Animation: Brief scale pulse (1.0 → 1.1 → 1.0)
  Duration: 0.5s once
```

#### **错误状态 (Error)**
```css
Location Button:
  Background: #FF3B30 (Error red)
  Border: 1pt solid #DC2626
  
Icon:
  Name: "location-off" or "warning"
  Color: #FFFFFF
  Animation: Brief shake (±2pt horizontal)
  Duration: 0.3s once
```

---

## 🔐 权限请求流程设计

### **首次权限请求设计**

#### **权限预解释界面**
```
┌─────────────────────────────────────┐
│            📍 Location Access        │
│                                     │
│  CLISAPP would like to access       │
│  your location to:                  │
│                                     │
│  ✅ Show your current area info     │
│  ✅ Find nearby environmental data  │
│  ✅ Provide relevant local insights │
│                                     │
│  Your location is only used for     │
│  map positioning. We don't store    │
│  or share your location data.       │
│                                     │
│  ┌─────────────┐  ┌───────────────┐ │
│  │   Allow     │  │  Not Now      │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

#### **系统权限对话框**
```
iOS系统对话框:
┌─────────────────────────────────────┐
│ "CLISAPP" Would Like to Use Your    │
│ Current Location                    │
│                                     │
│ Your current location will be used  │
│ to display your area on the map.    │
│                                     │
│ ┌─────────────┐  ┌───────────────┐ │
│ │ Don't Allow │  │     Allow     │ │
│ └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘

Android系统对话框:
┌─────────────────────────────────────┐
│ Allow CLISAPP to access this        │
│ device's location?                  │
│                                     │
│ ○ Precise location                  │
│ ○ Approximate location              │
│                                     │
│ ┌─────────────┐  ┌───────────────┐ │
│ │    DENY     │  │    ALLOW      │ │
│ └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

### **权限状态处理**

#### **权限被拒绝 - 首次**
```
Toast通知:
┌─────────────────────────────────────┐
│ 📍 Location access denied           │
│ You can search for areas manually   │
│ or enable location in Settings      │
└─────────────────────────────────────┘

按钮状态:
- 恢复到默认灰色状态
- 再次点击时重新请求权限
```

#### **权限被永久拒绝**
```
详细说明对话框:
┌─────────────────────────────────────┐
│          📍 Location Disabled        │
│                                     │
│  To use location features:          │
│                                     │
│  1. Open device Settings           │
│  2. Find CLISAPP                   │
│  3. Enable Location permission     │
│  4. Return to app                  │
│                                     │
│  Alternative: Use search to find   │
│  areas manually                    │
│                                     │
│  ┌─────────────┐  ┌───────────────┐ │
│  │   Settings  │  │      OK       │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

---

## 🎯 定位交互流程

### **成功定位流程**

#### **Step 1: 用户触发定位 (0s)**
```
用户操作: 点击定位按钮
即时反馈:
  - 按钮变为蓝色加载状态
  - 开始旋转动画
  - 如需要，显示权限请求
```

#### **Step 2: 权限检查 (0-1s)**
```
系统处理:
  - 检查位置权限状态
  - 如已授权，继续定位
  - 如未授权，显示权限请求
  
用户看到:
  - 持续的加载动画
  - 可能的权限对话框
```

#### **Step 3: GPS定位处理 (1-10s)**
```
系统处理:
  - 启动GPS/网络定位
  - 获取用户坐标
  - 验证位置在Queensland范围内
  
用户反馈:
  - 持续加载指示
  - 状态文字: "Locating..."
  - 超时提示: "This may take a moment..."
```

#### **Step 4: 地图跳转 (10-12s)**
```
系统处理:
  - 地图平滑飞行到用户位置
  - 显示用户位置标记
  - 匹配到对应的LGA/Suburb
  
视觉反馈:
  - 定位按钮变为绿色成功状态
  - 地图飞行动画
  - 用户位置标记出现
```

#### **Step 5: 信息展示 (12-13s)**
```
完成操作:
  - 自动显示当前区域信息卡
  - 高亮当前区域边界
  - 恢复定位按钮到默认状态
  
用户获得:
  - 当前位置的环境信息
  - 空间定位感知
  - 可进行后续操作
```

### **错误处理流程**

#### **GPS信号弱/无法定位**
```
错误检测: 10秒超时无响应
错误处理:
  - 定位按钮变红色
  - 显示错误提示toast
  - 提供重试和替代方案

Toast内容:
┌─────────────────────────────────────┐
│ ⚠️ Unable to get precise location    │
│ • Check GPS is enabled              │
│ • Try moving to open area           │
│ • Use search as alternative         │
│ [Retry] [Search Instead]            │
└─────────────────────────────────────┘
```

#### **位置在Queensland外**
```
错误检测: 坐标不在Queensland边界内
错误处理:
  - 定位按钮显示警告状态
  - 说明应用仅支持Queensland

Toast内容:
┌─────────────────────────────────────┐
│ 📍 Location outside Queensland      │
│ This app shows Queensland data only │
│ [Explore Queensland] [Dismiss]      │
└─────────────────────────────────────┘
```

#### **定位服务禁用**
```
错误检测: 系统定位服务关闭
错误处理:
  - 检测系统设置状态
  - 引导用户启用定位服务

引导对话框:
┌─────────────────────────────────────┐
│        📍 Location Services Off      │
│                                     │
│  Location services are disabled     │
│  on your device.                    │
│                                     │
│  To use location features:          │
│  • Open Settings                   │
│  • Enable Location Services        │
│  • Allow for CLISAPP               │
│                                     │
│  ┌─────────────┐  ┌───────────────┐ │
│  │   Settings  │  │   Cancel      │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

---

## 🎨 用户位置标记设计

### **位置标记样式**
```css
User Location Marker:
  Type: Custom marker (not default blue dot)
  
Outer Ring:
  Size: 20pt diameter
  Color: rgba(0,122,255,0.3) (Semi-transparent blue)
  Animation: Gentle pulsing (scale 1.0 ↔ 1.2)
  Duration: 2s infinite
  
Inner Dot:
  Size: 8pt diameter
  Color: #007AFF (Solid blue)
  Border: 2pt solid #FFFFFF
  Shadow: 0 1pt 3pt rgba(0,0,0,0.3)
  
Accuracy Circle (Optional):
  Radius: Based on GPS accuracy
  Color: rgba(0,122,255,0.1)
  Border: 1pt dashed rgba(0,122,255,0.5)
  Display: Only if accuracy > 100m
```

### **位置标记交互**
```javascript
// 位置标记点击行为
const userLocationMarker = {
  onPress: () => {
    // 显示位置详细信息
    showLocationInfoTooltip({
      accuracy: gpsAccuracy,
      timestamp: lastLocationUpdate,
      method: locationMethod, // GPS, Network, Passive
      coordinates: userLocation
    });
  },
  
  onLongPress: () => {
    // 显示位置操作菜单
    showLocationActions([
      'Refresh Location',
      'Share Location',
      'View Area Info'
    ]);
  }
};
```

### **定位精度指示**
```
高精度 (< 10m):
  标记: 实心蓝点，无外圈
  提示: "Precise location"
  
中等精度 (10-100m):
  标记: 蓝点 + 小范围外圈
  提示: "Approximate location"
  
低精度 (> 100m):
  标记: 蓝点 + 大范围虚线圆圈
  提示: "General area (±{accuracy}m)"
```

---

## 📐 响应式设计适配

### **不同屏幕尺寸的按钮适配**

#### **紧凑屏幕 (≤5.4")**
```css
Location Button:
  Size: 44pt × 44pt (iOS最小)
  Icon: 22pt × 22pt
  Position: 12pt from bottom and right
  
User Location Marker:
  Outer Ring: 16pt diameter
  Inner Dot: 6pt diameter
  Pulse Animation: Reduced intensity
```

#### **标准屏幕 (5.4"-6.7")**
```css
Location Button:
  Size: 48pt × 48pt (标准)
  Icon: 24pt × 24pt
  Position: 16pt from bottom and right
  
User Location Marker:
  Outer Ring: 20pt diameter
  Inner Dot: 8pt diameter
  Pulse Animation: Standard intensity
```

#### **大屏设备 (≥6.7")**
```css
Location Button:
  Size: 52pt × 52pt (较大)
  Icon: 26pt × 26pt
  Position: 20pt from bottom and right
  
User Location Marker:
  Outer Ring: 24pt diameter
  Inner Dot: 10pt diameter
  Pulse Animation: Enhanced visibility
```

### **横屏模式优化**
```
横屏定位按钮布局:
┌───────────────────────────────────────────────────────────┐
│ 🔍 Search...                                         ☰ │
├───────────────────────────────────────────────────────────┤
│                                                     ┌─┐   │
│                                                     │L│   │
│                    MAP VIEW                         └─┘   │
│                                                           │
│                                                     ┌─┐   │
│                                                     │📍│   │ ← 定位按钮
│                                                     └─┘   │   位置保持
└───────────────────────────────────────────────────────────┘

特点:
- 按钮位置相对固定在右下角
- 与其他控件保持适当间距
- 横屏时更容易用拇指操作
```

---

## 🔧 技术实现指南

### **React Native组件结构**
```javascript
<LocationService>
  <LocationButton
    ref={locationButtonRef}
    onPress={handleLocationRequest}
    style={locationStyles.button}
    disabled={isLocating}
  >
    <LocationIcon
      name={getLocationIconName(locationState)}
      size={24}
      color={getLocationIconColor(locationState)}
      style={locationState.isLoading && locationStyles.rotating}
    />
    
    {locationState.isLoading && (
      <ActivityIndicator
        style={locationStyles.loadingOverlay}
        size="small"
        color="#FFFFFF"
      />
    )}
  </LocationButton>
  
  {userLocation && (
    <MapView.Marker
      coordinate={userLocation}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={handleUserLocationPress}
    >
      <UserLocationMarker
        accuracy={locationAccuracy}
        timestamp={locationTimestamp}
      />
    </MapView.Marker>
  )}
  
  {showLocationTooltip && (
    <LocationTooltip
      location={userLocation}
      accuracy={locationAccuracy}
      onClose={() => setShowLocationTooltip(false)}
    />
  )}
</LocationService>
```

### **位置服务Hook实现**
```javascript
// 位置服务管理Hook
const useLocationService = () => {
  const [locationState, setLocationState] = useState({
    status: 'inactive', // inactive, loading, success, error
    location: null,
    accuracy: null,
    timestamp: null,
    error: null
  });
  
  // 权限检查
  const checkLocationPermission = useCallback(async () => {
    try {
      const permission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return permission === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }, []);
  
  // 权限请求
  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return permission === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }, []);
  
  // 获取当前位置
  const getCurrentLocation = useCallback(async () => {
    setLocationState(prev => ({ ...prev, status: 'loading', error: null }));
    
    try {
      // 检查权限
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }
      
      // 获取位置
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // 1分钟缓存
          }
        );
      });
      
      const { latitude, longitude, accuracy } = position.coords;
      
      // 验证位置在Queensland范围内
      if (!isWithinQueensland({ latitude, longitude })) {
        throw new Error('Location outside Queensland');
      }
      
      const newLocation = {
        latitude,
        longitude,
        accuracy,
        timestamp: Date.now()
      };
      
      setLocationState({
        status: 'success',
        location: newLocation,
        accuracy,
        timestamp: newLocation.timestamp,
        error: null
      });
      
      // 分析数据上报
      analytics.track('location_success', {
        accuracy,
        method: 'gps',
        duration: Date.now() - locationState.timestamp
      });
      
      return newLocation;
      
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        status: 'error',
        error: error.message
      }));
      
      // 错误上报
      analytics.track('location_error', {
        error: error.message,
        code: error.code
      });
      
      throw error;
    }
  }, [checkLocationPermission, requestLocationPermission]);
  
  // 定位按钮处理
  const handleLocationRequest = useCallback(async () => {
    try {
      const location = await getCurrentLocation();
      
      // 地图跳转到用户位置
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // 放大到街区级别
          longitudeDelta: 0.01
        }, 1000);
      }
      
      // 查找并显示区域信息
      const regionInfo = await findRegionByCoordinates(location);
      if (regionInfo) {
        showRegionInfo(regionInfo);
      }
      
    } catch (error) {
      handleLocationError(error);
    }
  }, [getCurrentLocation]);
  
  return {
    locationState,
    handleLocationRequest,
    clearLocation: () => setLocationState(prev => ({ 
      ...prev, 
      status: 'inactive', 
      location: null 
    }))
  };
};
```

### **错误处理实现**
```javascript
// 错误处理服务
const LocationErrorHandler = {
  handleError: (error) => {
    const errorMappings = {
      'PERMISSION_DENIED': {
        title: '📍 Location Access Denied',
        message: 'Enable location in Settings to use this feature',
        actions: ['Settings', 'Cancel']
      },
      'POSITION_UNAVAILABLE': {
        title: '⚠️ Location Unavailable',
        message: 'Unable to get your location. Check GPS settings.',
        actions: ['Retry', 'Search Instead']
      },
      'TIMEOUT': {
        title: '⏱️ Location Timeout',
        message: 'Location request timed out. Try again?',
        actions: ['Retry', 'Cancel']
      },
      'OUTSIDE_QUEENSLAND': {
        title: '📍 Outside Queensland',
        message: 'This app only shows Queensland environmental data.',
        actions: ['Explore Queensland', 'Dismiss']
      }
    };
    
    const errorInfo = errorMappings[error.code] || {
      title: '❌ Location Error',
      message: 'Something went wrong getting your location.',
      actions: ['Retry', 'Cancel']
    };
    
    showErrorDialog(errorInfo);
  }
};
```

---

## 🧪 用户测试计划

### **定位功能可用性测试**

#### **测试场景1: 首次使用定位**
```
测试目标: 验证新用户能够理解和使用定位功能
前置条件: 用户首次打开应用，未授权位置权限

测试步骤:
1. 用户点击定位按钮
2. 系统显示权限解释
3. 用户做出权限决定
4. 观察后续流程

观察重点:
- 权限解释的理解度
- 权限授权的意愿
- 定位结果的满意度

成功标准:
- 80%用户理解权限用途
- 70%用户愿意授权权限
- 90%用户满意定位准确性
```

#### **测试场景2: 定位错误处理**
```
测试环境: 模拟GPS信号弱的环境
测试目标: 验证错误处理的用户体验

测试步骤:
1. 在室内/地下室使用定位
2. 观察加载时间和错误提示
3. 测试重试功能
4. 评估替代方案的可用性

成功标准:
- 错误提示清晰易懂
- 重试功能正常工作
- 替代方案（搜索）可用
- 用户不会感到困惑
```

### **A/B测试方案**

#### **权限请求时机测试**
```
方案A: 点击定位按钮时请求权限 (当前)
方案B: 应用启动时预先解释并请求权限
方案C: 在用户首次浏览地图后提示权限

测试指标:
- 权限授权率
- 用户首次定位成功率
- 整体用户满意度
- 应用留存率
```

#### **定位按钮视觉设计测试**
```
方案A: 圆形定位图标 (当前)
方案B: 方形带背景的定位按钮
方案C: 文字+图标组合按钮

测试指标:
- 按钮可发现性
- 功能识别准确性
- 视觉满意度评分
```

---

## 📊 性能监控指标

### **关键性能指标**
```javascript
const locationMetrics = {
  // 功能性能
  locationRequestTime: 3000, // 平均定位时间(ms) - 目标<5000ms
  permissionGrantRate: 0.7, // 权限授权率 - 目标>0.6
  locationAccuracy: 50, // 平均定位精度(m) - 目标<100m
  locationSuccessRate: 0.85, // 定位成功率 - 目标>0.8
  
  // 用户行为
  locationUsageRate: 0.6, // 用户使用定位功能比率
  locationRetryRate: 0.2, // 定位重试率 - 目标<0.3
  permissionRevokeRate: 0.1, // 权限撤销率 - 目标<0.15
  
  // 技术性能
  batteryImpact: 0.02, // 电池影响 - 目标<0.05
  gpsColdStartTime: 8000, // GPS冷启动时间(ms)
  cacheHitRate: 0.4 // 位置缓存命中率
};
```

### **错误监控**
```javascript
const locationErrorTracking = {
  permissionDeniedRate: 0.3, // 权限拒绝率
  timeoutErrorRate: 0.15, // 超时错误率
  gpsUnavailableRate: 0.1, // GPS不可用率
  outsideRegionRate: 0.05, // Queensland外定位率
  
  // 错误恢复
  retrySuccessRate: 0.6, // 重试成功率
  alternativeUsageRate: 0.8, // 替代方案使用率
  errorResolutionTime: 30 // 平均错误解决时间(秒)
};
```

---

## 🔄 迭代优化计划

### **MVP版本 (Week 9-10)**
- [ ] 基础定位按钮和权限请求
- [ ] GPS定位和地图跳转功能
- [ ] 基本错误处理和提示
- [ ] 用户位置标记显示

### **优化版本1 (Week 11)**
- [ ] 改进权限请求流程和说明
- [ ] 增强错误处理和用户指导
- [ ] 定位精度指示和可视化
- [ ] 性能优化和电池管理

### **优化版本2 (Week 12)**
- [ ] 后台定位和智能提醒
- [ ] 位置历史和常用位置
- [ ] 无障碍功能增强
- [ ] 隐私设置和数据控制

### **最终版本 (Week 13)**
- [ ] 基于用户测试的体验优化
- [ ] 生产环境隐私合规检查
- [ ] 最终性能调优和监控
- [ ] 完整的用户指南和帮助

---

**设计负责人**: UX Designer + 隐私合规专家  
**技术实现**: 移动端工程师 + 位置服务专家  
**法规顾问**: 隐私法律顾问  
**用户验证**: UX研究员 + Queensland本地用户  
**文档版本**: 1.0 (MVP)
