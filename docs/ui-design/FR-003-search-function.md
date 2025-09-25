# FR-003: 区域搜索功能 UI设计文档
> 地名和邮编搜索及自动联想界面设计

## 📋 功能概览
- **功能ID**: FR-003
- **优先级**: 🔴 Must Have
- **复杂度**: 高
- **涉及平台**: iOS + Android
- **关键交互**: 搜索输入、自动联想、地图跳转

## 🎯 设计目标

### **核心目标**
1. **快速定位**: 用户能快速找到目标区域，跳转时间≤2秒
2. **智能联想**: 提供准确的搜索建议，匹配率≥90%
3. **容错能力**: 支持模糊搜索和常见拼写错误
4. **学习能力**: 记住用户搜索习惯，提供个性化建议

### **用户价值**
- 避免手动浏览寻找目标区域
- 快速访问感兴趣的地点
- 提供Queensland地理知识学习机会

---

## 📱 界面布局设计

### **搜索栏整体设计**
```
┌─────────────────────────────────────┐
│ 🔍 Search Queensland...        ☰ │ ← Header (64pt height)
├─────────────────────────────────────┤
│                                     │
│              MAP VIEW               │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Search Suggestions
│ │ 📍 Brisbane City (LGA)         │ │   (Overlay when typing)
│ │ 📍 Sunnybank (Suburb)          │ │
│ │ 📮 4000 (Postcode)             │ │
│ │ 📍 Ipswich (LGA)               │ │
│ │ 📍 Gold Coast (LGA)            │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### **搜索栏详细设计**

#### **默认状态 (Inactive)**
```css
Search Bar Container:
  Width: Screen Width - 32pt (16pt margin each side)
  Height: 48pt
  Background: rgba(255,255,255,0.95)
  Border Radius: 24pt (全圆角设计)
  Shadow: 0 2pt 8pt rgba(0,0,0,0.1)
  
Search Icon:
  Size: 20pt × 20pt
  Color: #757575 (Secondary text)
  Position: 14pt from left
  
Placeholder Text:
  Content: "Search Queensland..."
  Font: 16pt, Regular
  Color: #9E9E9E
  Position: 48pt from left (after icon + padding)
  
Menu Button:
  Size: 24pt × 24pt  
  Color: #757575
  Position: 12pt from right
```

#### **激活状态 (Active/Focused)**
```css
Search Bar Container:
  Width: Screen Width - 16pt (8pt margin each side)
  Height: 48pt
  Background: #FFFFFF
  Border: 2pt solid #007AFF
  Shadow: 0 4pt 12pt rgba(0,122,255,0.15)
  
Clear Button:
  Size: 20pt × 20pt
  Color: #757575
  Position: 14pt from right
  Animation: Fade in 0.2s when text appears
  
Cancel Button:
  Text: "Cancel"
  Font: 16pt, Medium
  Color: #007AFF
  Position: Right of search bar
  Animation: Slide in from right 0.3s
```

#### **搜索建议列表设计**
```css
Suggestions Container:
  Width: Screen Width - 16pt
  Max Height: 300pt (约6个建议项)
  Background: #FFFFFF
  Border Radius: 12pt
  Shadow: 0 8pt 24pt rgba(0,0,0,0.15)
  Position: Below search bar, 8pt gap
  
Suggestion Item:
  Height: 48pt
  Padding: 12pt horizontal
  Border Bottom: 1pt solid #F0F0F0 (except last item)
  
Icon:
  Size: 18pt × 18pt
  Colors: 
    📍 LGA/Suburb: #007AFF
    📮 Postcode: #FF9500
    🏢 City: #34C759
  Position: 12pt from left
  
Text Layout:
  Primary Text: Location name, 16pt Medium
  Secondary Text: Type + details, 14pt Regular, #757575
  Position: 42pt from left (after icon + padding)
```

---

## 🔍 搜索交互流程

### **标准搜索流程**

#### **Step 1: 搜索激活**
```
触发方式:
  - 点击搜索栏
  - 开始键盘输入
  
即时反应:
  - 搜索栏展开动画 (0.3s)
  - 键盘弹出
  - Cancel按钮滑入
  - 清除历史搜索或显示热门搜索
```

#### **Step 2: 输入处理**
```
输入监听:
  - 实时文字变化监听
  - 防抖处理 (300ms延迟)
  - 最小触发长度: 2个字符
  
处理逻辑:
  - 清洗输入文本 (去除特殊字符)
  - 匹配本地搜索索引
  - 按相关性排序结果
  - 限制返回数量: 最多8个建议
```

#### **Step 3: 建议展示**
```
显示规则:
  - 精确匹配优先显示
  - 前缀匹配次之
  - 模糊匹配最后
  - 地理层级排序: City > LGA > Suburb > Postcode
  
动画效果:
  - 建议列表淡入 (0.2s)
  - 列表项目逐个淡入 (staggered animation)
  - 滚动支持超出屏幕的建议
```

#### **Step 4: 选择确认**
```
选择方式:
  - 点击建议项
  - 键盘输入Enter确认第一项
  
确认反应:
  - 建议列表立即消失
  - 搜索栏显示选中项名称
  - 地图开始飞行动画到目标区域
  - 目标区域高亮显示
```

### **特殊场景处理**

#### **无搜索结果**
```
显示内容:
┌─────────────────────────────────────┐
│ 🔍 No results found                 │
│                                     │
│ Try searching for:                  │
│ • Brisbane, Gold Coast, Cairns      │
│ • Suburb names like Sunnybank       │
│ • Postcodes like 4000, 4217         │
│                                     │
│ Check spelling or try different     │
│ keywords                            │
└─────────────────────────────────────┘

交互选项:
- 提供搜索建议和示例
- 显示最近搜索历史
- 提供"清除搜索"选项
```

#### **网络错误状态**
```
显示内容:
┌─────────────────────────────────────┐
│ ⚠️ Search temporarily unavailable    │
│                                     │
│ • Using cached local data           │
│ • Check internet connection         │
│ • [Retry Search]                    │
└─────────────────────────────────────┘
```

#### **搜索历史功能**
```
历史记录显示:
┌─────────────────────────────────────┐
│ 🕒 Recent Searches                  │
│ 📍 Brisbane City                    │
│ 📍 Sunnybank                        │
│ 📮 4000                             │
│ ────────────────────────────────────│
│ 🔥 Popular Searches                 │
│ 📍 Gold Coast                       │
│ 📍 Cairns                           │
│ 📍 Toowoomba                        │
│ ────────────────────────────────────│
│ Clear History                       │
└─────────────────────────────────────┘
```

---

## 🎨 视觉设计详细规范

### **搜索状态的视觉层次**

#### **默认状态设计**
- **目标**: 不干扰地图浏览，但保持可发现性
- **视觉权重**: 低，融入整体界面
- **颜色**: 中性色调，微透明背景

#### **激活状态设计**
- **目标**: 成为界面焦点，引导用户完成搜索
- **视觉权重**: 高，明显的颜色对比和阴影
- **颜色**: 品牌主色调，白色背景

#### **结果状态设计**
- **目标**: 清晰展示选项，便于快速选择
- **视觉权重**: 中高，列表层次清晰
- **颜色**: 分类色彩编码，提高识别效率

### **图标系统设计**
```
搜索相关图标:
🔍 Search Icon: 通用搜索标识
📍 Location Pin: LGA和Suburb区域
📮 Postcode: 邮编结果
🏢 City: 主要城市
🕒 History: 搜索历史
🔥 Popular: 热门搜索
⚠️ Error: 错误状态
✕ Clear: 清除文本

图标规范:
- 尺寸: 18pt × 18pt (建议列表)
- 尺寸: 20pt × 20pt (搜索栏)
- 样式: 线性图标，2pt线宽
- 颜色: 语义化色彩编码
```

### **动画效果设计**
```javascript
// 搜索栏激活动画
const activationAnimation = {
  searchBar: {
    scale: [1, 1.02, 1],
    borderColor: ['transparent', '#007AFF'],
    shadow: ['0 2pt 8pt rgba(0,0,0,0.1)', '0 4pt 12pt rgba(0,122,255,0.15)']
  },
  cancelButton: {
    opacity: [0, 1],
    translateX: [20, 0]
  },
  duration: 300,
  easing: 'ease-out'
};

// 建议列表动画
const suggestionsAnimation = {
  container: {
    opacity: [0, 1],
    translateY: [-10, 0],
    scale: [0.95, 1]
  },
  items: {
    opacity: [0, 1],
    translateX: [-20, 0],
    stagger: 50 // 每个项目延迟50ms
  },
  duration: 200,
  easing: 'ease-out'
};

// 地图跳转动画
const mapFlyAnimation = {
  duration: 1500,
  curve: 'ease-in-out',
  highlight: {
    opacity: [0, 0.8, 0.6],
    scale: [1.2, 1.1, 1.0]
  }
};
```

---

## 📐 响应式设计策略

### **不同屏幕尺寸适配**

#### **紧凑屏幕 (≤5.4")**
```css
Search Bar:
  Height: 44pt (iOS最小触控区域)
  Font Size: 15pt
  Icon Size: 18pt
  
Suggestions:
  Max Height: 250pt (约5个项目)
  Item Height: 44pt
  Font Size: 15pt primary, 13pt secondary
  
Margins:
  Horizontal: 12pt
  Vertical: 8pt between search and suggestions
```

#### **标准屏幕 (5.4"-6.7")**
```css
Search Bar:
  Height: 48pt
  Font Size: 16pt
  Icon Size: 20pt
  
Suggestions:
  Max Height: 300pt (约6个项目)
  Item Height: 48pt
  Font Size: 16pt primary, 14pt secondary
  
Margins:
  Horizontal: 16pt
  Vertical: 8pt between search and suggestions
```

#### **大屏设备 (≥6.7")**
```css
Search Bar:
  Height: 52pt
  Font Size: 17pt
  Icon Size: 22pt
  Max Width: 400pt (防止过宽)
  
Suggestions:
  Max Height: 350pt (约7个项目)
  Item Height: 52pt
  Font Size: 17pt primary, 15pt secondary
  
Margins:
  Horizontal: 20pt
  Vertical: 12pt between search and suggestions
```

### **横屏模式优化**
```
横屏搜索布局:
┌───────────────────────────────────────────────────────────┐
│ 🔍 Search Queensland...                              ☰ │
├─────────────────────────┬─────────────────────────────────┤
│                         │ ┌─────────────────────────────┐ │
│                         │ │ 📍 Brisbane City           │ │
│        MAP VIEW         │ │ 📍 Sunnybank               │ │
│                         │ │ 📮 4000                    │ │
│                         │ │ 📍 Ipswich                 │ │
│                         │ └─────────────────────────────┘ │
└─────────────────────────┴─────────────────────────────────┘

特点:
- 搜索建议在右侧显示，不遮挡地图
- 搜索栏保持在顶部，全宽度
- 地图区域更大，更好的空间体验
```

---

## 🔧 技术实现指南

### **React Native组件结构**
```javascript
<SearchContainer>
  <SearchBar
    ref={searchBarRef}
    placeholder="Search Queensland..."
    value={searchQuery}
    onChangeText={handleSearchInput}
    onFocus={handleSearchFocus}
    onBlur={handleSearchBlur}
    autoCorrect={false}
    autoComplete="off"
    returnKeyType="search"
    onSubmitEditing={handleSearchSubmit}
    style={searchStyles.searchBar}
  >
    <SearchIcon name="search" size={20} color="#757575" />
    
    {searchQuery.length > 0 && (
      <TouchableOpacity onPress={clearSearch}>
        <ClearIcon name="close" size={20} color="#757575" />
      </TouchableOpacity>
    )}
  </SearchBar>
  
  {showCancel && (
    <Animated.View style={[searchStyles.cancelButton, cancelButtonStyle]}>
      <TouchableOpacity onPress={handleCancel}>
        <Text style={searchStyles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </Animated.View>
  )}
  
  {showSuggestions && (
    <SearchSuggestions
      suggestions={searchSuggestions}
      onSuggestionPress={handleSuggestionSelect}
      isLoading={isSearching}
      error={searchError}
      style={searchStyles.suggestions}
    />
  )}
</SearchContainer>
```

### **搜索逻辑实现**
```javascript
// 搜索处理 Hook
const useSearch = () => {
  const [searchState, setSearchState] = useState({
    query: '',
    suggestions: [],
    isLoading: false,
    error: null,
    history: []
  });
  
  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSearchState(prev => ({ ...prev, suggestions: [] }));
        return;
      }
      
      setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const results = await searchService.search(query, {
          limit: 8,
          types: ['lga', 'suburb', 'postcode', 'city'],
          region: 'queensland'
        });
        
        setSearchState(prev => ({
          ...prev,
          suggestions: results,
          isLoading: false
        }));
        
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
      }
    }, 300),
    []
  );
  
  // 搜索输入处理
  const handleSearchInput = useCallback((query) => {
    setSearchState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);
  
  // 选择建议
  const selectSuggestion = useCallback(async (suggestion) => {
    // 添加到历史记录
    const newHistory = [
      suggestion,
      ...searchState.history.filter(item => item.id !== suggestion.id)
    ].slice(0, 10); // 保留最近10个
    
    setSearchState(prev => ({
      ...prev,
      query: suggestion.name,
      suggestions: [],
      history: newHistory
    }));
    
    // 存储到本地
    await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // 地图跳转
    await mapService.flyTo(suggestion.coordinates, {
      zoom: suggestion.type === 'suburb' ? 14 : 11,
      duration: 1500
    });
    
    // 高亮显示
    mapService.highlightRegion(suggestion.id);
    
    // 分析数据上报
    analytics.track('search_selection', {
      query: searchState.query,
      suggestion: suggestion.name,
      type: suggestion.type
    });
  }, [searchState.history]);
  
  return {
    searchState,
    handleSearchInput,
    selectSuggestion,
    clearSearch: () => setSearchState(prev => ({ ...prev, query: '', suggestions: [] }))
  };
};
```

### **搜索服务实现**
```javascript
// 搜索服务类
class SearchService {
  constructor() {
    this.searchIndex = null;
    this.initialized = false;
  }
  
  // 初始化搜索索引
  async initialize() {
    if (this.initialized) return;
    
    try {
      // 加载搜索数据
      const searchData = await this.loadSearchData();
      
      // 创建Fuse.js搜索索引
      this.searchIndex = new Fuse(searchData, {
        keys: [
          { name: 'name', weight: 1.0 },
          { name: 'aliases', weight: 0.8 },
          { name: 'postcode', weight: 0.6 },
          { name: 'type', weight: 0.4 }
        ],
        threshold: 0.4, // 模糊匹配阈值
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true
      });
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize search service:', error);
      throw error;
    }
  }
  
  // 执行搜索
  async search(query, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const {
      limit = 8,
      types = ['lga', 'suburb', 'postcode', 'city'],
      region = 'queensland'
    } = options;
    
    // 搜索执行
    const results = this.searchIndex.search(query, { limit: limit * 2 });
    
    // 结果过滤和排序
    const filteredResults = results
      .filter(result => types.includes(result.item.type))
      .slice(0, limit)
      .map(result => ({
        ...result.item,
        score: result.score
      }));
    
    // 按类型和相关性排序
    return this.sortSearchResults(filteredResults);
  }
  
  // 结果排序
  sortSearchResults(results) {
    const typeOrder = { city: 0, lga: 1, suburb: 2, postcode: 3 };
    
    return results.sort((a, b) => {
      // 首先按类型排序
      const typeComparison = typeOrder[a.type] - typeOrder[b.type];
      if (typeComparison !== 0) return typeComparison;
      
      // 然后按搜索分数排序
      return a.score - b.score;
    });
  }
  
  // 加载搜索数据
  async loadSearchData() {
    // 从缓存或网络加载搜索数据
    const cachedData = await AsyncStorage.getItem('searchData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // 网络加载
    const response = await fetch('/api/search-data');
    const data = await response.json();
    
    // 缓存数据
    await AsyncStorage.setItem('searchData', JSON.stringify(data));
    
    return data;
  }
}
```

---

## 🧪 用户测试计划

### **搜索功能可用性测试**

#### **测试场景1: 首次搜索体验**
```
测试目标: 验证新用户能否直观地使用搜索功能
前置条件: 用户首次打开应用

测试任务:
1. "请找到Brisbane市的位置"
2. "请搜索Sunnybank区域"
3. "请查找邮编4000对应的区域"

观察重点:
- 搜索栏的可发现性
- 搜索建议的理解度
- 地图跳转的满意度

成功标准:
- 95%用户能成功发现搜索功能
- 90%用户能理解搜索建议分类
- 85%用户对跳转结果满意
```

#### **测试场景2: 复杂搜索任务**
```
测试任务: "比较Gold Coast和Cairns两个地区"
预期行为:
1. 搜索Gold Coast并查看结果
2. 搜索Cairns并比较位置
3. 可能使用搜索历史功能

测试指标:
- 搜索准确率: 目标>95%
- 任务完成时间: 目标<3分钟
- 搜索重试次数: 目标<2次
```

### **A/B测试方案**

#### **搜索建议数量测试**
```
方案A: 显示6个建议 (当前)
方案B: 显示8个建议
方案C: 显示10个建议

测试指标:
- 选择率: 用户选择建议的比例
- 滚动行为: 用户是否滚动查看更多
- 决策时间: 从显示到选择的时间
- 满意度: 主观体验评分
```

#### **搜索历史显示策略**
```
方案A: 显示最近5个搜索
方案B: 显示最近3个 + 热门2个
方案C: 不显示历史，只显示热门

测试指标:
- 历史使用率: 用户点击历史项的频率
- 搜索效率: 重复搜索的减少程度
- 用户满意度: 对个性化体验的满意度
```

---

## 📊 性能监控与优化

### **关键性能指标**
```javascript
const searchMetrics = {
  // 响应性能
  searchLatency: 200, // 搜索响应时间(ms) - 目标<300ms
  suggestionDisplayTime: 150, // 建议显示时间(ms) - 目标<200ms
  mapFlyDuration: 1500, // 地图跳转时间(ms)
  
  // 准确性指标
  searchAccuracy: 0.95, // 搜索准确率 - 目标>0.9
  firstResultRelevance: 0.9, // 首个结果相关性 - 目标>0.85
  userSelectionRate: 0.85, // 用户选择建议比率 - 目标>0.8
  
  // 用户行为
  averageSearchLength: 8, // 平均搜索字符数
  searchRetryRate: 0.15, // 搜索重试率 - 目标<0.2
  emptyResultRate: 0.05, // 空结果率 - 目标<0.1
  
  // 技术性能
  indexLoadTime: 500, // 搜索索引加载时间(ms) - 目标<1000ms
  memoryUsage: 25, // 搜索功能内存使用(MB) - 目标<50MB
  cacheHitRate: 0.8 // 缓存命中率 - 目标>0.7
};
```

### **性能优化策略**
```javascript
// 1. 搜索索引优化
const optimizeSearchIndex = () => {
  // 分层索引: 热门搜索 + 完整索引
  const hotSearchIndex = createHotSearchIndex(popularSearches);
  const fullSearchIndex = createFullSearchIndex(allSearchData);
  
  return {
    search: async (query) => {
      // 先搜索热门索引
      const hotResults = hotSearchIndex.search(query);
      if (hotResults.length >= 3) return hotResults;
      
      // 再搜索完整索引
      const fullResults = fullSearchIndex.search(query);
      return [...hotResults, ...fullResults].slice(0, 8);
    }
  };
};

// 2. 智能预加载
const useSearchPreloading = () => {
  useEffect(() => {
    // 预加载热门搜索数据
    const preloadPopularSearches = async () => {
      const popular = await getPopularSearches();
      await Promise.all(
        popular.map(search => preloadMapData(search.coordinates))
      );
    };
    
    preloadPopularSearches();
  }, []);
};

// 3. 缓存策略
const useSearchCache = () => {
  const cache = useRef(new Map());
  
  const getCachedResult = (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    return cache.current.get(normalizedQuery);
  };
  
  const setCachedResult = (query, result) => {
    const normalizedQuery = query.toLowerCase().trim();
    cache.current.set(normalizedQuery, result);
    
    // 限制缓存大小
    if (cache.current.size > 100) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
  };
  
  return { getCachedResult, setCachedResult };
};
```

---

## 🔄 迭代优化路线图

### **MVP版本 (Week 9-10)**
- [ ] 基础搜索栏和建议列表
- [ ] 核心搜索逻辑和地图跳转
- [ ] 基本错误处理
- [ ] Queensland数据索引建立

### **优化版本1 (Week 11)**
- [ ] 搜索历史和个性化
- [ ] 性能优化和缓存策略
- [ ] 改进的动画和交互效果
- [ ] A/B测试框架集成

### **优化版本2 (Week 12)**
- [ ] 高级搜索功能 (过滤、排序)
- [ ] 语音搜索支持 (如果资源允许)
- [ ] 无障碍功能完善
- [ ] 跨平台一致性优化

### **最终版本 (Week 13)**
- [ ] 基于用户测试的优化
- [ ] 搜索分析和智能推荐
- [ ] 生产环境性能调优
- [ ] 文档和培训完善

---

**设计负责人**: UX Designer + 搜索体验专家  
**技术实现**: Frontend团队 + 搜索引擎工程师  
**数据支持**: GIS数据工程师  
**用户验证**: UX研究员 + Queensland本地测试用户  
**文档版本**: 1.0 (MVP)
