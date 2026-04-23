<template>
	<view class="page-container">
		<text class="title">检验报告提醒</text>
		
		<view v-if="checkupRecords.length === 0" class="empty-tip">
			<text>暂无检查报告提醒</text>
		</view>
		
		<view v-else class="report-list">
			<view class="report-item" v-for="record in checkupRecords" :key="record.id">
				<text class="report-name">{{ record.type }}</text>
				<text class="report-status" :class="record.status">
					{{ record.status === 'pending' ? '待检查' : '已出结果' }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentUser: '',
			checkupRecords: []
		}
	},
	onShow() {
		const storedUser = uni.getStorageSync('current_user');
		this.currentUser = storedUser !== undefined && storedUser !== null ? String(storedUser) : 'test_user';
		this.loadCheckupRecords();
	},
	methods: {
		loadCheckupRecords() {
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getCheckupRecords',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.checkupRecords = res.result.data || [];
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载检查记录失败', err);
					this.checkupRecords = [];
				}
			});
		}
	}
}
</script>

<style>
	.page-container { padding: 40rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 40rpx; font-weight: bold; margin-bottom: 40rpx; text-align: center; margin-top: 40rpx; }
	
	.empty-tip { text-align: center; color: #666; font-size: 28rpx; margin-top: 100rpx; }
	
	.report-list { margin-top: 20rpx; }
	
	.report-item { background: #fff; padding: 30rpx; border-radius: 16rpx; display: flex; justify-content: space-between; align-items: center; border: 2rpx solid #eee; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.report-name { font-size: 32rpx; color: #333; }
	.report-status { font-size: 28rpx; font-weight: bold; }
	.report-status.pending { color: #f59e0b; }
	.report-status.completed { color: #52c41a; }
</style>
