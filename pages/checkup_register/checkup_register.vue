<template>
	<view class="page-container">
		<text class="title">体检注册</text>
		<view class="form-area">
			<view class="input-group">
				<text>姓名</text>
				<input type="text" v-model="formData.name" placeholder="请输入真实姓名" />
			</view>
			<view class="input-group">
				<text>身份证号</text>
				<input type="idcard" v-model="formData.idCard" placeholder="请输入身份证号码" />
			</view>
			<view class="input-group">
				<text>联系电话</text>
				<input type="number" v-model="formData.phone" placeholder="请输入手机号码" />
			</view>
			<view class="input-group">
				<text>既往病史</text>
				<input type="text" v-model="formData.medicalHistory" placeholder="（选填）" />
			</view>
			<button class="btn" @click="handleRegister">立即注册健康档案</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				name: '',
				idCard: '',
				phone: '',
				medicalHistory: ''
			},
			currentUser: ''
		}
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('current_user') || 'test_user';
	},
	methods: {
		handleRegister() {
			// 表单验证
			if (!this.formData.name) {
				uni.showToast({ title: '请输入姓名', icon: 'none' });
				return;
			}
			if (!this.formData.idCard) {
				uni.showToast({ title: '请输入身份证号', icon: 'none' });
				return;
			}
			if (!this.formData.phone) {
				uni.showToast({ title: '请输入联系电话', icon: 'none' });
				return;
			}
			
			// 创建健康档案
			const healthRecord = {
				name: this.formData.name,
				idCard: this.formData.idCard,
				phone: this.formData.phone,
				medicalHistory: this.formData.medicalHistory || '无',
				createTime: new Date().toISOString(),
				status: 'active'
			};
			
			// 存储健康档案到数据库
			uni.showLoading({ title: '注册中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'saveHealthRecord',
					username: this.currentUser,
					data: healthRecord
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						// 显示成功提示
						uni.showToast({ title: '健康档案注册成功', icon: 'success' });
						
						// 跳转到体检预约页面
						setTimeout(() => {
							uni.redirectTo({ url: '/pages/checkup/checkup' });
						}, 1500);
					} else {
						uni.showToast({ title: res.result.message, icon: 'none' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('注册健康档案失败', err);
					uni.showToast({ title: '注册失败', icon: 'none' });
				}
			});
		},

	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.form-area { background: #fff; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.input-group { margin-bottom: 30rpx; }
	.input-group text { font-size: 28rpx; color: #333; font-weight: bold; margin-bottom: 10rpx; display: block; }
	.input-group input { height: 80rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 0 20rpx; font-size: 28rpx; }
	.btn { background: #10b981; color: #fff; font-size: 32rpx; border-radius: 40rpx; height: 80rpx; line-height: 80rpx; margin-top: 40rpx; }
	.btn::after { border: none; }
</style>
