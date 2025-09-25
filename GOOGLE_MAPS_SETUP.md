# Google Maps API 密钥配置指南

## 🗝️ 获取 API 密钥

### 1. 创建 Google Cloud 项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 登录 Google 账户
3. 点击 **"创建项目"**
4. 项目名称: `CLISApp-Development`
5. 点击 **"创建"**

### 2. 启用必要的 API
1. 左侧菜单 → **"API 和服务"** → **"库"**
2. 搜索并启用以下 API:
   - ✅ **Maps SDK for iOS**
   - ✅ **Maps SDK for Android**

### 3. 创建 API 密钥
1. 左侧菜单 → **"API 和服务"** → **"凭据"**
2. 点击 **"+ 创建凭据"** → **"API 密钥"**
3. 复制生成的 API 密钥
4. **重要**: 立即限制 API 密钥！

### 4. 限制 API 密钥 (安全)
1. 在凭据页面，点击你的 API 密钥
2. **"API 限制"** → **"限制密钥"**
3. 选择:
   - ✅ Maps SDK for iOS
   - ✅ Maps SDK for Android

## 📱 配置应用

### iOS 配置
将你的 API 密钥替换到以下文件：

**文件**: `ios/CLISApp/Info.plist`
```xml
<key>GMSApiKey</key>
<string>你的API密钥替换这里</string>
```

### Android 配置
将你的 API 密钥替换到以下文件：

**文件**: `android/app/src/main/AndroidManifest.xml`
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="你的API密钥替换这里" />
```

## 🔒 安全提示

1. **不要提交 API 密钥到 Git**: 
   - API 密钥已配置在原生文件中
   - 这些文件应该在 `.gitignore` 中

2. **使用环境变量** (推荐):
   ```bash
   # 设置环境变量
   export GOOGLE_MAPS_API_KEY="你的密钥"
   ```

3. **限制 API 密钥使用**:
   - 只启用需要的 API
   - 设置使用配额限制

## 💰 费用说明

**免费额度** (每月):
- Maps SDK: 免费额度通常足够开发使用
- 超出免费额度后按使用量计费

**开发建议**:
- 开发阶段使用免费额度
- 生产环境考虑付费计划

## 🧪 测试配置

配置完成后，运行应用测试：

```bash
# iOS
npm run ios

# Android  
npm run android
```

**验证成功标志**:
- ✅ 地图正常显示
- ✅ 可以看到街道和地名
- ✅ 气候数据层叠加在地图上
- ✅ ConnectionStatus 显示 "Connected"

## ❌ 常见问题

### 问题 1: 地图显示空白
**解决方案**:
- 检查 API 密钥是否正确
- 确认已启用对应平台的 Maps SDK
- 检查网络连接

### 问题 2: "API key not authorized"
**解决方案**:  
- 检查 API 限制设置
- 确认包名/Bundle ID 配置正确

### 问题 3: 超出配额
**解决方案**:
- 检查 Google Cloud Console 配额使用情况
- 考虑升级到付费计划

## 🚀 下一步

配置完成后，你可以：
1. 启动 React Native 应用
2. 测试地图功能
3. 验证气候数据显示
4. 测试搜索功能

---

**需要帮助?** 
- [Google Maps Platform 文档](https://developers.google.com/maps)
- [React Native Maps 文档](https://github.com/react-native-maps/react-native-maps)
