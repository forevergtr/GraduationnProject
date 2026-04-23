<template>
	<view class="page-container">
		<text class="title">产科建档(孕妇)</text>
		<view class="form-area">
			<text class="form-title">基本信息登记</text>
			<view class="input-group">
				<text>孕妇姓名：</text>
				<input type="text" v-model="formData.name" placeholder="请输入姓名" />
			</view>
			<view class="input-group">
				<text>末次月经：</text>
				<picker mode="date" :start="startDate" :end="endDate" @change="handleDateChange">
					<view class="picker-view">{{ formData.lastPeriod || '请选择日期' }}</view>
				</picker>
			</view>
			<view class="input-group">
				<text>预产期：</text>
				<text class="result">{{ dueDate || '（系统自动计算）' }}</text>
			</view>
			<button class="btn" @click="handleSubmit">提交建档申请</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				name: '',
				lastPeriod: ''
			},
			startDate: '',
			endDate: '',
			dueDate: '',
			currentUser: ''
		}
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('current_user') || 'test_user';
		// 设置日期选择范围
		const today = new Date();
		const threeYearsAgo = new Date();
		threeYearsAgo.setFullYear(today.getFullYear() - 3);
		this.startDate = threeYearsAgo.toISOString().split('T')[0];
		this.endDate = today.toISOString().split('T')[0];
	},
	methods: {
		handleDateChange(e) {
			this.formData.lastPeriod = e.detail.value;
			// 计算预产期
			this.calculateDueDate();
		},
		calculateDueDate() {
			if (!this.formData.lastPeriod) {
				this.dueDate = '';
				return;
			}
			
			const lastPeriodDate = new Date(this.formData.lastPeriod);
			// 预产期计算：末次月经日期加上280天（40周）
			const dueDate = new Date(lastPeriodDate);
			dueDate.setDate(dueDate.getDate() + 280);
			
			// 格式化预产期
			this.dueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
		},
		handleSubmit() {
			// 表单验证
			if (!this.formData.name) {
				uni.showToast({ title: '请输入孕妇姓名', icon: 'none' });
				return;
			}
			if (!this.formData.lastPeriod) {
				uni.showToast({ title: '请选择末次月经日期', icon: 'none' });
				return;
			}
			
			// 创建建档信息
			const obstetricsRecord = {
				name: this.formData.name,
				lastPeriod: this.formData.lastPeriod,
				dueDate: this.dueDate,
				createTime: new Date().toISOString(),
				status: 'pending'
			};
			
			// 存储建档信息到数据库
			uni.showLoading({ title: '提交中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'saveObstetricsRecord',
					username: this.currentUser,
					data: obstetricsRecord
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						// 显示成功提示
						uni.showToast({ title: '建档申请提交成功', icon: 'success' });
						
						// 跳转到个人中心页面
				setTimeout(() => {
							uni.redirectTo({ url: '/pages/profile/profile' });
						}, 1500);
					} else {
						uni.showToast({ title: res.result.message, icon: 'none' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('提交建档申请失败', err);
					uni.showToast({ title: '提交失败', icon: 'none' });
				}
			});
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.form-area { background: #fff; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.form-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 30rpx; display: block; border-bottom: 2rpx solid #eee; padding-bottom: 20rpx; }
	.input-group { display: flex; align-items: center; margin-bottom: 30rpx; font-size: 28rpx; color: #333; }
	.input-group text:first-child { width: 160rpx; }
	.input-group input, .picker-view { flex: 1; height: 60rpx; line-height: 60rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 0 20rpx; color: #666; }
	.result { color: #999; }
	.btn { background: #f59e0b; color: #fff; font-size: 32rpx; border-radius: 40rpx; height: 80rpx; line-height: 80rpx; margin-top: 40rpx; }
	.btn::after { border: none; }
</style>
