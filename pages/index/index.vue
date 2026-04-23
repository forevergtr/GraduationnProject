<template>
	<view class="container">
		<!-- Top Blue Background Decorator -->
		<view class="bg-decorator"></view>
		
		<!-- Main Content Area -->
		<view class="content-wrapper">
			
			<!-- Image Swiper / Banner -->
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" circular="true">
				<swiper-item v-for="(img, index) in banners" :key="index">
				<view class="swiper-item-view" :style="{ backgroundColor: img.color }">
					<text class="swiper-text">{{ img.text }}</text>
					<text class="swiper-subtext">{{ img.subtext }}</text>
				</view>
			</swiper-item>
			</swiper>

			<!-- Notification Bar -->
		<view class="notification-card" @click="navigateTo('/pages/notification/notification')">
			<text class="noti-text">{{ notificationText }}</text>
			<text class="noti-arrow">></text>
		</view>

			<!-- Personal Center Section: 个人中心 -->
			<view class="section-card personal-center-section">
				<text class="section-title">个人中心</text>
				<view class="personal-center-content">
					<view class="personal-item" @click="navigateTo('/pages/profile/profile')">
						<text class="personal-item-title">个人信息</text>
						<text class="personal-item-arrow">></text>
					</view>
					<view class="personal-item" @click="handleLogout">
						<text class="personal-item-title">退出登录</text>
						<text class="personal-item-arrow">></text>
					</view>
				</view>
			</view>

			<!-- Medical Section: 就医 -->
			<view class="section-card">
				<text class="section-title">就医</text>
				
				<!-- Tabs: 门诊 / 住院 -->
				<view class="tab-bar">
					<view class="tab-item" :class="{ active: activeTab === 'outpatient' }" @click="activeTab = 'outpatient'">
						<text>门诊</text>
					</view>
					<view class="tab-item" :class="{ active: activeTab === 'inpatient' }" @click="activeTab = 'inpatient'">
						<text>住院</text>
					</view>
				</view>
				
				<!-- Outpatient Grid Swiper -->
				<swiper class="grid-swiper" v-if="activeTab === 'outpatient'" :indicator-dots="true" indicator-active-color="#3b82f6" indicator-color="#d1d5db">
					<!-- Page 1 -->
					<swiper-item>
						<view class="grid-container">
							<view class="grid-item" v-for="(item, index) in outpatientServices.slice(0, 8)" :key="index" @click="navigateTo(item.url)">
								<view class="icon-circle" :style="{ backgroundColor: item.color }">
									<text class="icon-text">{{ item.icon }}</text>
								</view>
								<text class="label">{{ item.name }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
				
				<!-- Inpatient Grid Swiper -->
				<swiper class="grid-swiper" v-if="activeTab === 'inpatient'" :indicator-dots="true" indicator-active-color="#3b82f6" indicator-color="#d1d5db">
					<swiper-item>
						<view class="grid-container">
							<view class="grid-item" v-for="(item, index) in inpatientServices" :key="index" @click="navigateTo(item.url)">
								<view class="icon-circle" :style="{ backgroundColor: item.color }">
									<text class="icon-text">{{ item.icon }}</text>
								</view>
								<text class="label">{{ item.name }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			
			<!-- Other Section: 其他 -->
			<view class="section-card">
				<text class="section-title">其他</text>
				<swiper class="grid-swiper other-swiper" :indicator-dots="true" indicator-active-color="#3b82f6" indicator-color="#d1d5db">
					<swiper-item>
						<view class="grid-container single-row">
							<view class="grid-item" v-for="(item, index) in otherServices" :key="index" @click="navigateTo(item.url)">
								<view class="icon-circle" :style="{ backgroundColor: item.color }">
									<text class="icon-text">{{ item.icon }}</text>
								</view>
								<text class="label">{{ item.name }}</text>
							</view>
						</view>
					</swiper-item>
					<!-- Page 2 -->
					<swiper-item>
						<view class="grid-container single-row">
							<view class="grid-item" @click="navigateTo('/pages/profile/profile')">
								<view class="icon-circle" style="background-color: #6c8afb;">
									<text class="icon-text">👤</text>
								</view>
								<text class="label">个人中心</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			
		</view>
		
		<!-- Footer -->
		<view class="footer">
			<text class="footer-text">吕宇照</text>
			<text class="footer-text sub">230100405</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentUser: '',
				activeTab: 'outpatient',
				notificationText: '检验报告提醒【V2】',
				banners: [
				{ color: '#4CAF50', text: '专业医疗服务', subtext: '提供全方位的健康管理' },
				{ color: '#2196F3', text: '在线便捷问诊', subtext: '足不出户，轻松就医' },
				{ color: '#FF9800', text: '智能健康档案', subtext: '个人健康数据一目了然' },
				{ color: '#9C27B0', text: '体检预约服务', subtext: '定期体检，预防疾病' }
			],
				outpatientServices: [
					{ name: '预约挂号', icon: '🔍', color: '#10b981', url: '/pages/appointment/appointment' },
					{ name: '线上问诊', icon: '💬', color: '#6366f1', url: '/pages/online_consult/online_consult' },
					{ name: '我的挂号', icon: '📅', color: '#3b82f6', url: '/pages/record/record' },
					{ name: '门诊缴费', icon: '💰', color: '#10b981', url: '/pages/payment/payment' },
					{ name: '体检预约', icon: '🩺', color: '#8b5cf6', url: '/pages/checkup_appoint/checkup_appoint' },
					{ name: '健康管理中心', icon: '🏥', color: '#3b82f6', url: '/pages/health_center/health_center' },
					{ name: '检验检查', icon: '🔬', color: '#8b5cf6', url: '/pages/report/report' },
					{ name: '就诊指引', icon: '🧭', color: '#3b82f6', url: '/pages/guide/guide' }
				],
				inpatientServices: [
					{ name: '住院预交金', icon: '💰', color: '#10b981', url: '/pages/inpatient_payment/inpatient_payment' },
					{ name: '每日清单', icon: '📋', color: '#3b82f6', url: '/pages/daily_list/daily_list' },
					{ name: '出院结算', icon: '🧾', color: '#8b5cf6', url: '/pages/discharge/discharge' },
					{ name: '病案复印', icon: '📁', color: '#2db7f5', url: '/pages/record_copy/record_copy' }
				],
				otherServices: [
					{ name: '医院简介', icon: '🏥', color: '#10b981', url: '/pages/hospital_intro/hospital_intro' },
					{ name: '产科建档(新)', icon: '👶', color: '#f59e0b', url: '/pages/obstetrics/obstetrics' },
					{ name: '就医反馈', icon: '💬', color: '#8b5cf6', url: '/pages/feedback/feedback' },
					{ name: '体检注册', icon: '📝', color: '#8b5cf6', url: '/pages/checkup_register/checkup_register' }
				]
			}
		},
		onShow() {
			// 检查是否登录
			const user = uni.getStorageSync('current_user');
			if (!user) {
				uni.redirectTo({
					url: '/pages/login/login'
				});
			} else {
				this.currentUser = user;
				// 更新检查报告提醒
				this.updateNotificationText();
			}
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			updateNotificationText() {
				const hasReminder = uni.getStorageSync('checkup_reminder');
				if (hasReminder) {
					this.notificationText = '检验报告提醒【有新报告】';
				} else {
					this.notificationText = '检验报告提醒【V2】';
				}
			},
			handleLogout() {
				uni.showModal({
					title: '退出登录',
					content: '确认要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除登录信息
							uni.removeStorageSync('current_user');
							// 跳转到登录页面
							uni.redirectTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #f4f6f8;
	}
	
	.container {
		position: relative;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}

	/* Top background decorator */
	.bg-decorator {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 350rpx;
		background: linear-gradient(180deg, #6c8afb 0%, #90aefd 100%);
		z-index: 0;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
	}

	.content-wrapper {
		position: relative;
		z-index: 1;
		padding: 30rpx;
		padding-top: 40rpx;
	}

	/* Banner Swiper */
	.banner-swiper {
		height: 300rpx;
		width: 100%;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
	}

	.swiper-item-view {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.swiper-text {
		color: #fff;
		font-size: 36rpx;
		font-weight: bold;
		letter-spacing: 2rpx;
		text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
		margin-bottom: 20rpx;
	}

	.swiper-subtext {
		color: #fff;
		font-size: 24rpx;
		text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.2);
		opacity: 0.9;
	}

	.personal-center-content {
		margin-top: 10rpx;
	}

	.personal-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.personal-item:last-child {
		border-bottom: none;
	}

	.personal-item-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.personal-item-arrow {
		font-size: 32rpx;
		color: #ccc;
		font-weight: 300;
	}

	.personal-center-section {
		padding: 20rpx 30rpx;
	}

	.personal-center-section .section-title {
		margin-bottom: 15rpx;
	}

	.personal-center-section .personal-item {
		padding: 18rpx 0;
	}

	/* Notification Card */
	.notification-card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
	}

	.noti-text {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.noti-arrow {
		color: #ccc;
		font-size: 36rpx;
	}

	/* Section Card (就医 / 其他) */
	.section-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
	}

	.section-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 24rpx;
	}

	/* Tab Bar (门诊 / 住院) */
	.tab-bar {
		display: flex;
		border: 2rpx solid #3b82f6;
		border-radius: 40rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 16rpx 0;
		font-size: 30rpx;
		color: #3b82f6;
		background-color: #fff;
		transition: all 0.3s;
	}

	.tab-item.active {
		background-color: #3b82f6;
		color: #fff;
	}

	/* Grid Swiper */
	.grid-swiper {
		height: 380rpx; /* Fits 2 rows */
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 30rpx;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 180rpx;
		width: 100%;
	}

	.icon-circle {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
		position: relative;
		flex-shrink: 0;
	}

	.grid-container.single-row {
		grid-template-rows: 1fr;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 180rpx;
	}

	.icon-circle {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
		position: relative;
	}

	.icon-text {
		font-size: 48rpx;
		color: #fff;
		line-height: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.label {
		font-size: 22rpx;
		color: #333;
		text-align: center;
		width: 100%;
		line-height: 1.3;
		white-space: normal;
		word-break: break-all;
		padding: 0 10rpx;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 190rpx;
		width: 100%;
	}

	/* 调整其他服务的网格高�?*/
	.grid-swiper.other-swiper {
		height: 220rpx; /* 增加高度以确保图标对�?*/
	}

	/* Footer */
	.footer {
		position: absolute;
		bottom: 40rpx;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.footer-text {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.footer-text.sub {
		font-size: 20rpx;
		color: #bbb;
	}
</style>
