<template>
	<view class="page-container">
		<!-- 顶部 Tabs -->
		<view class="tabs">
			<view class="tab-item" :class="{ active: currentTab === 'upcoming' }" @click="switchTab('upcoming')">
				<text>待就诊</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 'completed' }" @click="switchTab('completed')">
				<text>已就诊</text>
			</view>
			<view class="tab-item" :class="{ active: currentTab === 'canceled' }" @click="switchTab('canceled')">
				<text>已取消</text>
			</view>
		</view>

		<!-- 挂号记录列表 -->
		<scroll-view scroll-y class="record-list">
			<view class="record-card" v-for="item in filteredRecords" :key="item.id || item._id">
				<view class="card-header">
					<text class="dept-name">{{ item.deptName }}</text>
					<text class="status-text" :class="item.status">{{ getStatusText(item.status) }}</text>
				</view>
				
				<view class="card-content">
					<view class="info-row">
						<text class="label">就诊医生：</text>
						<text class="value">{{ item.doctorName }}</text>
					</view>
					<view class="info-row">
						<text class="label">就诊时间：</text>
						<text class="value highlight">{{ item.date }} {{ item.time }}</text>
					</view>
					<view class="info-row">
						<text class="label">挂号费用：</text>
						<text class="value fee">¥{{ item.fee }}</text>
					</view>
					<view class="info-row">
						<text class="label">预约时间：</text>
						<text class="value">{{ item.createTime }}</text>
					</view>
				</view>

				<!-- 操作按钮（仅待就诊状态显示） -->
				<view class="card-actions" v-if="item.status === 'upcoming'">
					<button class="action-btn cancel-btn" @click="handleCancel(item.id || item._id)">取消挂号</button>
					<button class="action-btn complete-btn" @click="handleComplete(item.id || item._id)">模拟就诊完成</button>
				</view>
			</view>

			<view v-if="filteredRecords.length === 0" class="empty-tip">
				<text>暂无相关挂号记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTab: 'upcoming', // upcoming, completed, canceled
				records: [],
				currentUser: ''
			}
		},
		onShow() {
			this.loadRecords();
		},
		computed: {
			filteredRecords() {
				return this.records.filter(r => r.status === this.currentTab);
			}
		},
		methods: {
			switchTab(tab) {
				this.currentTab = tab;
			},
			getStatusText(status) {
				const map = {
					'upcoming': '待就诊',
					'completed': '已完成',
					'canceled': '已取消'
				};
				return map[status] || '未知状态';
			},
			loadRecords() {
				const storedUser = uni.getStorageSync('current_user');
				this.currentUser = storedUser !== undefined && storedUser !== null ? String(storedUser) : 'test_user';
				
				uni.showLoading({ title: '加载中...' });
				uniCloud.callFunction({
					name: 'uniCloud',
					data: {
						action: 'getAppointments',
						username: this.currentUser
					},
					success: (res) => {
						uni.hideLoading();
						if (res.result.code === 0) {
							this.records = res.result.data || [];
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('加载预约记录失败', err);
						this.records = [];
					}
				});
			},
			saveRecords() {
				const storageKey = `appointments_${this.currentUser}`;
				uni.setStorageSync(storageKey, JSON.stringify(this.records));
			},
			handleCancel(id) {
				uni.showModal({
					title: '提示',
					content: '确认要取消本次挂号吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({ title: '处理中...' });
							// 使用云函数更新预约状态
							uniCloud.callFunction({
								name: 'uniCloud',
								data: {
									action: 'updateAppointment',
									username: this.currentUser,
									recordId: id,
									data: { status: 'canceled' }
								},
								success: (res) => {
									uni.hideLoading();
									if (res.result.code === 0) {
										// 更新本地数据
										const index = this.records.findIndex(r => (r.id === id || r._id === id));
										if (index > -1) {
											this.records[index].status = 'canceled';
										}
										uni.showToast({ title: '已取消挂号', icon: 'success' });
									} else {
										uni.showToast({ title: res.result.message, icon: 'none' });
									}
								},
								fail: (err) => {
									uni.hideLoading();
									console.error('取消挂号失败', err);
									uni.showToast({ title: '操作失败', icon: 'none' });
								}
							});
						}
					}
				});
			},
			handleComplete(id) {
				uni.showModal({
					title: '模拟就诊',
					content: '确认已完成本次就诊？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({ title: '处理中...' });
							const record = this.records.find(r => (r.id === id || r._id === id));
							
							if (!record) {
								uni.hideLoading();
								uni.showToast({ title: '找不到预约记录', icon: 'none' });
								return;
							}
							
							// 生成待缴费项目
							const paymentItem = {
								appointmentId: id,
								deptName: record.deptName,
								doctorName: record.doctorName,
								amount: record.fee,
								status: 'pending', // pending: 待缴费 paid: 已缴费
								createTime: new Date().toISOString()
							};
							
							// 存储待缴费项目到数据库
							uniCloud.callFunction({
								name: 'uniCloud',
								data: {
									action: 'savePayment',
									username: this.currentUser,
									data: paymentItem
								},
								success: (res) => {
									if (res.result.code === 0) {
							// 使用云函数更新预约状态
							uniCloud.callFunction({
											name: 'uniCloud',
											data: {
												action: 'updateAppointment',
												username: this.currentUser,
												recordId: id,
												data: { status: 'completed' }
											},
											success: (res2) => {
												uni.hideLoading();
												if (res2.result.code === 0) {
													// 更新本地数据
													const index = this.records.findIndex(r => (r.id === id || r._id === id));
													if (index > -1) {
														this.records[index].status = 'completed';
													}
													uni.showToast({ title: '就诊完成', icon: 'success' });
													
													// 就诊完成后提醒缴费
							setTimeout(() => {
								uni.showModal({
									title: '缴费提醒',
									content: '就诊已完成，请及时前往缴费处或通过手机完成缴费。',
									confirmText: '知道了',
									showCancel: false
								});
						}, 500);
												} else {
													uni.hideLoading();
													uni.showToast({ title: res2.result.message, icon: 'none' });
												}
											},
											fail: (err) => {
												uni.hideLoading();
												console.error('更新预约状态失败', err);
												uni.showToast({ title: '操作失败', icon: 'none' });
											}
										});
									} else {
										uni.hideLoading();
										uni.showToast({ title: res.result.message, icon: 'none' });
									}
								},
								fail: (err) => {
									uni.hideLoading();
									console.error('生成缴费项目失败', err);
									uni.showToast({ title: '操作失败', icon: 'none' });
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	.page-container { display: flex; flex-direction: column; height: 100vh; background-color: #f4f6f8; }
	
	/* 顶部 Tabs */
	.tabs { display: flex; background: #fff; height: 90rpx; border-bottom: 2rpx solid #eee; position: sticky; top: 0; z-index: 10; }
	.tab-item { flex: 1; display: flex; justify-content: center; align-items: center; font-size: 28rpx; color: #666; position: relative; }
	.tab-item.active { color: #3b82f6; font-weight: bold; }
	.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60rpx; height: 6rpx; background: #3b82f6; border-radius: 6rpx; }
	
	/* 记录列表 */
	.record-list { flex: 1; padding: 20rpx; box-sizing: border-box; }
	
	.record-card { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2rpx dashed #eee; padding-bottom: 20rpx; margin-bottom: 20rpx; }
	.dept-name { font-size: 32rpx; font-weight: bold; color: #333; }
	.status-text { font-size: 28rpx; font-weight: bold; }
	.status-text.upcoming { color: #f59e0b; }
	.status-text.completed { color: #10b981; }
	.status-text.canceled { color: #999; }
	
	.card-content { display: flex; flex-direction: column; gap: 16rpx; }
	.info-row { display: flex; font-size: 28rpx; }
	.label { color: #666; width: 140rpx; }
	.value { color: #333; flex: 1; }
	.value.highlight { color: #3b82f6; font-weight: bold; }
	.value.fee { color: #f5222d; font-weight: bold; }
	
	.card-actions { display: flex; justify-content: flex-end; gap: 20rpx; margin-top: 30rpx; padding-top: 20rpx; border-top: 2rpx solid #eee; }
	.action-btn { margin: 0; padding: 0 30rpx; height: 64rpx; line-height: 64rpx; font-size: 26rpx; border-radius: 32rpx; background: #fff; }
	.action-btn::after { border: none; }
	.cancel-btn { color: #f5222d; border: 2rpx solid #f5222d; }
	.complete-btn { color: #10b981; border: 2rpx solid #10b981; }
	
	.empty-tip { text-align: center; color: #999; font-size: 28rpx; margin-top: 100rpx; }
</style>
