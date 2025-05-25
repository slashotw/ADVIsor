# ADVisor - Active Directory 管理系統

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-purple.svg)](https://vitejs.dev/)

一個現代化、全面的 Active Directory 管理系統，使用 React 和 TypeScript 構建。ADVisor 提供了管理使用者、群組、組織單位、權限和安全政策的完整解決方案，具有直觀的網頁介面。

[English README](README_EN.md) | [GitHub 上傳指南](GITHUB_UPLOAD_GUIDE.md)

## ✨ 主要功能

- **儀表板** - 系統概覽、統計數據、安全警示
- **使用者管理** - 使用者列表、詳細資料、批量操作
- **群組管理** - 安全群組、通訊群組、成員管理
- **組織單位** - 樹狀結構顯示、階層管理
- **權限管理** - 權限矩陣、角色管理、風險評估
- **稽核日誌** - 操作記錄、安全事件、合規報告
- **工作流程** - 自動化流程、審批管理
- **自助服務** - 密碼重設、個人資料更新
- **AD 視覺化** - 樹狀圖、關係圖表
- **系統設定** - AD 連線、安全政策配置

## 🚀 快速開始

### 前置需求
- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. **複製專案**
```bash
git clone https://github.com/yourusername/advicer.git
cd advicer
```

2. **安裝依賴**
```bash
npm install
```

3. **啟動開發伺服器**
```bash
npm run dev
```

4. **開啟瀏覽器**
```
http://localhost:5173
```

## 📋 運行模式

### 模式一：純模擬數據（推薦用於展示）
- ✅ 立即可用
- ✅ 完整功能展示
- ✅ 安全 - 不會影響真實系統

### 模式二：API + 模擬數據回退
- ✅ 可連接真實 AD（需要後端）
- ✅ 自動回退確保可用性
- ⚠️ 需要後端 API 配置

## 🛠️ 技術棧

- **React 18** - 前端框架
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式設計
- **Vite** - 建置工具
- **React Router** - 路由管理
- **Lucide React** - 圖示庫
- **D3.js** - 數據視覺化

## 🚀 部署

### 建置專案
```bash
npm run build
```

### 部署選項
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

詳細部署指南請參考 [GitHub 上傳指南](GITHUB_UPLOAD_GUIDE.md)

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案

## 🤝 貢獻

歡迎貢獻！請隨時提交 Pull Request。

## 📞 支援

如有任何問題或疑問：
1. 查看文檔
2. 搜尋現有 Issues
3. 建立新的 Issue

---

**注意：** 這是一個展示用的管理系統。在生產環境中使用前，請確保實施適當的安全措施和身份驗證。

## 📊 Feature Showcase

### Dashboard
- User statistics
- Security alerts
- Recent activities
- System status

### User Management
- User listing and search
- Bulk operations
- Detailed profile views
- Group membership relations

### Group Management
- Security and distribution groups
- Member management
- Permission views
- Statistical information

### Permission Management
- Permission matrix
- Risk assessment
- Over-privileged account detection
- Compliance reporting

## 🛠️ Built With

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Routing
- **Lucide React** - Icons
- **D3.js** - Data visualization

## 📈 Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Plugin system
- [ ] LDAP integration
- [ ] SSO support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors who help improve this project

---

**Note:** This is a demonstration management system. Please ensure proper security measures and authentication are implemented before using in production environments.

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### User Management
![User Management](screenshots/users.png)

### Group Management
![Group Management](screenshots/groups.png)

### AD Visualization
![AD Visualization](screenshots/visualization.png)

---

Made with ❤️ by [Your Name] 