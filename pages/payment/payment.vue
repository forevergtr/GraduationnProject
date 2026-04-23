<template>
	<view class="page-container">
		<text class="title">门诊缴费</text>
		
		<view v-if="allPayments.length === 0" class="empty-tip">
			<text>暂无缴费项目</text>
		</view>
		
		<view v-else class="payment-list">
			<view class="payment-item" v-for="item in allPayments" :key="item.id || item._id">
				<view class="item-header">
					<text class="dept-name">{{ item.type === 'inpatient' ? '住院预交金' : item.type === 'discharge' ? '出院结算' : item.type === 'checkup' ? '体检预约' : item.type === 'online_consult' ? '线上问诊' : item.deptName }}</text>
					<text class="status-text" :class="item.status">{{ item.status === 'pending' ? '待缴费' : '已缴费' }}</text>
				</view>
				
				<view class="item-content">
					<view class="info-row" v-if="item.type !== 'inpatient'">
						<text class="label">就诊医生：</text>
						<text class="value">{{ item.doctorName }}</text>
					</view>
					<view class="info-row">
						<text class="label">缴费金额：</text>
						<text class="value amount">¥{{ item.amount }}</text>
					</view>
					<view class="info-row">
						<text class="label">生成时间：</text>
						<text class="value">{{ formatTime(item.createTime) }}</text>
					</view>
				</view>
				
				<view class="item-actions" v-if="item.status === 'pending'">
					<button class="pay-btn" @click="handlePay(item.id || item._id)">立即缴费</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			payments: [],
			currentUser: ''
		}
	},
	onShow() {
		this.loadPayments();
	},
	computed: {
		pendingPayments() {
			return this.payments.filter(p => p.status === 'pending');
		},
		allPayments() {
			return this.payments;
		}
	},
	methods: {
		loadPayments() {
			const storedUser = uni.getStorageSync('current_user');
			this.currentUser = storedUser !== undefined && storedUser !== null ? String(storedUser) : 'test_user';
			
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getPayments',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.payments = res.result.data || [];
						
						if (this.payments.length === 0) {
							const testPayment = {
								id: `payment_${Date.now()}`,
								type: 'discharge',
								deptName: '住院部',
								doctorName: '住院医生',
								amount: 450,
								status: 'pending',
								createTime: new Date().toISOString()
							};
							
							uniCloud.callFunction({
								name: 'uniCloud',
								data: {
									action: 'savePayment',
									username: this.currentUser,
									data: testPayment
								}
							});
							
							this.payments.push(testPayment);
						}
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载缴费信息失败', err);
					this.payments = [];
				}
			});
		},
		savePayments() {
			const storageKey = `payments_${this.currentUser}`;
			uni.setStorageSync(storageKey, JSON.stringify(this.payments));
		},
		handlePay(id) {
			uni.showModal({
				title: '缴费确认',
				content: '确认要缴费吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '缴费中...' });
						const paymentItem = this.payments.find(p => (p.id === id || p._id === id));
						
						if (!paymentItem) {
							uni.hideLoading();
							uni.showToast({ title: '找不到缴费记录', icon: 'none' });
							return;
						}
						
						uniCloud.callFunction({
							name: 'uniCloud',
							data: {
								action: 'updatePayment',
								username: this.currentUser,
								recordId: id,
								data: { status: 'paid' }
							},
							success: (res) => {
								if (res.result.code === 0) {
									if (paymentItem.deptName === '检查科') {
										const checkupInfo = {
											type: paymentItem.doctorName,
											amount: paymentItem.amount,
											status: 'pending',
											createTime: new Date().toISOString(),
											paymentId: paymentItem.id || paymentItem._id
										};
										
										uniCloud.callFunction({
											name: 'uniCloud',
											data: {
												action: 'saveCheckupRecord',
												username: this.currentUser,
												data: checkupInfo
											}
										});
									}
									
									uni.hideLoading();
									uni.showToast({ title: '缴费成功', icon: 'success' });
									this.loadPayments();
								} else {
									uni.hideLoading();
									uni.showToast({ title: res.result.message, icon: 'none' });
								}
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('缴费失败', err);
								uni.showToast({ title: '缴费失败', icon: 'none' });
							}
						});
					}
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
	.page-container { display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f6f8; padding: 40rpx; }
	
	.title { font-size: 40rpx; font-weight: bold; margin-bottom: 20rpx; margin-top: 40rpx; text-align: center; }
	
	.empty-tip { text-align: center; color: #666; font-size: 28rpx; margin-top: 100rpx; }
	
	.payment-list { margin-top: 40rpx; }
	
	.payment-item { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	
	.item-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2rpx dashed #eee; padding-bottom: 20rpx; margin-bottom: 20rpx; }
	.dept-name { font-size: 32rpx; font-weight: bold; color: #333; }
	.status-text { font-size: 28rpx; font-weight: bold; }
	.status-text.pending { color: #f59e0b; }
	.status-text.paid { color: #10b981; }
	
	.item-content { display: flex; flex-direction: column; gap: 16rpx; }
	.info-row { display: flex; font-size: 28rpx; }
	.label { color: #666; width: 140rpx; }
	.value { color: #333; flex: 1; }
	.value.amount { color: #f59e0b; font-weight: bold; font-size: 32rpx; }
	
	.item-actions { margin-top: 20rpx; text-align: right; }
	.pay-btn { background: #3b82f6; color: #fff; border-radius: 30rpx; padding: 0 40rpx; height: 70rpx; line-height: 70rpx; font-size: 28rpx; }
	.pay-btn::after { border: none; }
</style>
