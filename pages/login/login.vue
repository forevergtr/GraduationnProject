<template>
	<view class="login-container">
		<view class="header">
			<text class="title">智慧医疗系统</text>
			<text class="subtitle">登录您的账号</text>
		</view>

		<view class="form-container">
			<view class="input-group">
				<text class="label">用户名</text>
				<input class="input" type="text" v-model="username" placeholder="请输入用户名" />
			</view>

			<view class="input-group">
				<text class="label">密码</text>
				<input class="input" type="password" v-model="password" placeholder="请输入密码" />
			</view>

			<button class="btn login-btn" @click="handleLogin">登录</button>
			<button class="btn register-btn" @click="handleRegister">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		onLoad() {
			const currentUser = uni.getStorageSync('current_user');
			if (currentUser) {
				uni.redirectTo({
					url: '/pages/index/index'
				});
			}
		},
		methods: {
			handleLogin() {
				if (!this.username || !this.password) {
					uni.showToast({ title: '请输入用户名和密码', icon: 'none' });
					return;
				}

				uni.showLoading({ title: '登录中...' });
				uniCloud.callFunction({
					name: 'uniCloud',
					data: {
						action: 'login',
						username: this.username,
						password: this.password
					},
					success: (res) => {
						uni.hideLoading();
						if (res.result && res.result.code === 0) {
							uni.setStorageSync('current_user', this.username);
							uni.showToast({ title: '登录成功', icon: 'success' });
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/index/index'
								});
							}, 500);
						} else {
							const errorMessage = res.result && res.result.message ? res.result.message : '登录失败';
							uni.showToast({ title: errorMessage, icon: 'none' });
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({ title: '登录失败，请检查网络', icon: 'none' });
					}
				});
			},
			handleRegister() {
				if (!this.username || !this.password) {
					uni.showToast({ title: '请输入要注册的用户名和密码', icon: 'none' });
					return;
				}

				uni.showLoading({ title: '注册中...' });
				uniCloud.callFunction({
					name: 'uniCloud',
					data: {
						action: 'register',
						username: this.username,
						password: this.password
					},
					success: (res) => {
						uni.hideLoading();
						if (res.result && res.result.code === 0) {
							uni.showToast({ title: '注册成功，请登录', icon: 'success' });
						} else {
							uni.showToast({ title: res.result.message, icon: 'none' });
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({ title: '注册失败，请检查网络', icon: 'none' });
					}
				});
			}
		}
	}
</script>

<style>
	.login-container {
		padding: 40rpx;
		height: 100vh;
		background-color: #f4f6f8;
		box-sizing: border-box;
	}

	.header {
		margin-top: 20rpx;
		margin-bottom: 40rpx;
		padding-left: 20rpx;
	}

	.title {
		font-size: 50rpx;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 20rpx;
	}

	.subtitle {
		font-size: 30rpx;
		color: #888;
		display: block;
	}

	.form-container {
		background: #ffffff;
		padding: 40rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
		text-align: left;
	}

	.input {
		height: 80rpx;
		border-bottom: 2rpx solid #eee;
		font-size: 32rpx;
	}

	.btn {
		height: 90rpx;
		border-radius: 45rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		margin-top: 30rpx;
	}

	.login-btn {
		background-color: #1890ff;
		color: #fff;
	}

	.register-btn {
		background-color: #f5f5f5;
		color: #666;
		border: 2rpx solid #ddd;
	}
</style>
