<template>
	<view class="page-container">
		<text class="title">病案复印</text>
		<view class="form-area">
			<view class="form-item">
				<text class="label">住院号</text>
				<input class="input" type="text" placeholder="请输入住院号" v-model="formData.hospitalId" />
			</view>
			<view class="form-item">
				<text class="label">复印份数</text>
				<input class="input" type="number" placeholder="请输入需要复印的份数" v-model.number="formData.copyCount" />
			</view>
			<view class="form-item">
				<text class="label">收件地址</text>
				<textarea class="textarea" placeholder="请输入详细的收件地址（支持邮寄）" v-model="formData.address"></textarea>
			</view>
			<button class="submit-btn" @click="handleSubmit">提交申请</button>
		</view>
		
		<view class="history-section" v-if="historyRecords.length > 0">
			<text class="history-title">历史申请</text>
			<view class="history-item" v-for="(record, index) in historyRecords" :key="index">
				<view class="history-header">
					<text class="history-hospitalId">住院号：{{ record.hospitalId }}</text>
					<text class="history-status">{{ record.status }}</text>
				</view>
				<text class="history-detail">复印份数：{{ record.copyCount }}份</text>
				<text class="history-detail">收件地址：{{ record.address }}</text>
				<text class="history-time">{{ formatTime(record.createTime) }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				hospitalId: '',
				copyCount: '',
				address: ''
			},
			historyRecords: [],
			currentUser: ''
		}
	},
	onShow() {
		this.currentUser = uni.getStorageSync('current_user');
		this.loadHistoryRecords();
	},
	methods: {
		handleSubmit() {
			// 表单验证
			if (!this.formData.hospitalId) {
				uni.showToast({ title: '请输入住院号', icon: 'none', position: 'center' });
				return;
			}
			if (!this.formData.copyCount || this.formData.copyCount <= 0) {
				uni.showToast({ title: '请输入有效的复印份数', icon: 'none', position: 'center' });
				return;
			}
			if (!this.formData.address) {
				uni.showToast({ title: '请输入收件地址', icon: 'none', position: 'center' });
				return;
			}
			
			// 提交申请
			uni.showLoading({ title: '提交中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'saveMedicalRecordCopy',
					username: this.currentUser,
					data: {
						...this.formData,
						status: '已收到',
						createTime: new Date().toISOString()
					}
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						// 显示收到提示
						uni.showToast({ title: '收到', icon: 'success', position: 'center' });
						
						// 清空表单
						this.formData = {
							hospitalId: '',
							copyCount: '',
							address: ''
						};
						
						// 重新加载历史记录
						this.loadHistoryRecords();
					} else {
						uni.showToast({ title: res.result.message, icon: 'none', position: 'center' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('提交申请失败', err);
					uni.showToast({ title: '提交失败', icon: 'none', position: 'center' });
				}
			});
		},
		loadHistoryRecords() {
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getMedicalRecordCopies',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.historyRecords = res.result.data || [];
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载历史记录失败', err);
					this.historyRecords = [];
				}
			});
		},
		formatTime(timeStr) {
			const date = new Date(timeStr);
			return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.form-area { background: #fff; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); margin-bottom: 30rpx; }
	.form-item { margin-bottom: 30rpx; }
	.label { font-size: 28rpx; color: #333; margin-bottom: 10rpx; display: block; font-weight: bold; }
	.input { height: 80rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 0 20rpx; font-size: 28rpx; }
	.textarea { height: 160rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; width: 100%; box-sizing: border-box; }
	.submit-btn { background: #3b82f6; color: #fff; font-size: 32rpx; border-radius: 40rpx; height: 80rpx; line-height: 80rpx; margin-top: 20rpx; }
	.history-section { background: #fff; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.history-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 20rpx; display: block; }
	.history-item { border-bottom: 2rpx solid #eee; padding: 20rpx 0; }
	.history-item:last-child { border-bottom: none; }
	.history-header { display: flex; justify-content: space-between; margin-bottom: 10rpx; }
	.history-hospitalId { font-size: 28rpx; color: #333; font-weight: bold; }
	.history-status { font-size: 24rpx; color: #10b981; font-weight: bold; }
	.history-detail { font-size: 24rpx; color: #666; margin-bottom: 5rpx; display: block; }
	.history-time { font-size: 22rpx; color: #999; margin-top: 10rpx; display: block; }
</style>
