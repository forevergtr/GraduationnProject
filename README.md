# IoT Medical - 智慧医疗服务平台

基于 uni-app 开发的智慧医疗服务平台，提供预约挂号、线上问诊、门诊缴费、体检预约等一站式医疗服务。

## 功能模块

### 门诊服务
- **预约挂号** - 支持按科室、医生进行预约挂号
- **线上问诊** - 提供在线图文问诊服务
- **门诊缴费** - 在线缴纳门诊费用
- **就诊指引** - 详细的就诊流程指引

### 体检服务
- **体检预约** - 在线预约体检套餐
- **体检注册** - 体检信息登记
- **检验检查** - 查看检验检查报告
- **检验报告提醒** - 报告出具提醒通知

### 住院服务
- **住院预交金** - 住院预交金充值与管理
- **每日清单** - 查看每日费用明细
- **出院结算** - 出院费用结算

### 其他功能
- **病案复印** - 在线申请病案复印
- **产科建档** - 产科建档服务
- **就医反馈** - 患者满意度评价
- **医院简介** - 医院基本信息展示
- **个人中心** - 用户信息与健康管理

## 技术栈

- **前端框架**: uni-app (Vue.js)
- **UI组件**: 原生组件
- **云开发**: uniCloud (阿里云)
- **开发工具**: HBuilderX

## 项目结构

```
iot-medical/
├── pages/                    # 页面目录
│   ├── appointment/          # 预约挂号
│   ├── checkup_appoint/      # 体检预约
│   ├── checkup_register/     # 体检注册
│   ├── daily_list/           # 每日清单
│   ├── discharge/            # 出院结算
│   ├── feedback/             # 就医反馈
│   ├── guide/                # 就诊指引
│   ├── health_center/        # 健康中心
│   ├── hospital_intro/       # 医院简介
│   ├── index/                # 首页
│   ├── inpatient_payment/    # 住院预交金
│   ├── login/                # 登录
│   ├── notification/         # 检验报告提醒
│   ├── obstetrics/           # 产科建档
│   ├── online_consult/       # 线上问诊
│   ├── payment/              # 门诊缴费
│   ├── profile/              # 个人中心
│   ├── qrcode/               # 二维码
│   ├── record/               # 记录
│   ├── record_copy/          # 病案复印
│   └── report/               # 检验检查
├── static/                   # 静态资源
├── uniCloud-aliyun/          # 云函数
│   ├── cloudfunctions/       # 云函数代码
│   └── database/             # 数据库配置
├── uni_modules/              # uni-app 插件
├── App.vue                   # 应用入口
├── main.js                   # 主入口文件
├── manifest.json             # 应用配置
├── pages.json                # 页面路由配置
└── uni.scss                  # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- HBuilderX >= 3.0.0
- Git

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/forevergtr/GraduationnProject.git
cd iot-medical
```

2. 使用 HBuilderX 打开项目

3. 运行项目
   - 点击工具栏的"运行"按钮
   - 选择运行到浏览器或模拟器

### 云函数部署

1. 在 HBuilderX 中右键 `uniCloud-aliyun` 目录
2. 选择"创建云服务空间"
3. 右键云函数目录，选择"上传部署"

## 作者

- **吕宇照** - 学号: 230100405

## 许可证

本项目仅供学习交流使用。
