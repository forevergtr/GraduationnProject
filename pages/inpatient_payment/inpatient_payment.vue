<template>
	<view class="page-container">
		<text class="title">住院预交金</text>
		<view class="balance-card">
			<text class="label">当前预交金余额</text>
			<text class="amount">¥ {{ formatAmount(balance) }}</text>
		</view>
		<view class="recharge-section">
			<text class="section-title">充值金额</text>
			<view class="options">
				<view class="option-btn" :class="{ active: selectedAmount === amt }" v-for="amt in [500, 1000, 2000, 5000]" :key="amt" @click="selectAmt(amt)">
					<text>¥ {{ amt }}</text>
				</view>
			</view>
			<input class="custom-input" type="digit" placeholder="输入其他金额" v-model="customAmount" @input="handleCustomAmount" />
			<button class="pay-btn" @click="handleRecharge">立即充值</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			balance: 5000,
			selectedAmount: 500,
			customAmount: '',
			currentUser: ''
		}
	},
	onShow() {
		this.currentUser = uni.getStorageSync('current_user');
		this.loadBalance();
	},
	methods: {
		loadBalance() {
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getInpatientBalance',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.balance = res.result.data || 0;
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载预交金余额失败', err);
					this.balance = 0;
				}
			});
		},
		saveBalance() {
			uni.showLoading({ title: '保存中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'saveInpatientBalance',
					username: this.currentUser,
					data: { balance: this.balance }
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code !== 0) {
						console.error('保存预交金余额失败', res.result.message);
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('保存预交金余额失败', err);
				}
			});
		},
		selectAmt(amt) {
			this.selectedAmount = amt;
			this.customAmount = '';
		},
		handleCustomAmount(e) {
			this.customAmount = e.target.value;
			if (this.customAmount) {
				this.selectedAmount = parseInt(this.customAmount) || 0;
			}
		},
		handleRecharge() {
			const amount = this.selectedAmount || parseInt(this.customAmount) || 0;
			if (amount <= 0) {
				uni.showToast({ title: '请输入有效金额', icon: 'none', position: 'center' });
				return;
			}
			
			uni.showModal({
				title: '充值确认',
				content: `确认充值 ¥${amount} 到住院预交金？`,
				success: (res) => {
					if (res.confirm) {
						this.balance += amount;
						this.saveBalance();
						
						const paymentItem = {
							type: 'inpatient',
							amount: amount,
							status: 'paid',
							createTime: new Date().toISOString()
						};
						
						uniCloud.callFunction({
							name: 'uniCloud',
							data: {
								action: 'savePayment',
								username: this.currentUser,
								data: paymentItem
							}
						});
						
						uni.showToast({ title: '充值成功', icon: 'success', position: 'center' });
					}
				}
			});
		},
		formatAmount(amount) {
			return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.balance-card { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 20rpx; padding: 40rpx; color: #fff; text-align: center; margin-bottom: 40rpx; box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.4); }
	.label { font-size: 28rpx; opacity: 0.9; margin-bottom: 20rpx; display: block; }
	.amount { font-size: 60rpx; font-weight: bold; display: block; }
	.recharge-section { background: #fff; border-radius: 20rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.section-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 30rpx; display: block; }
	.options { display: flex; flex-wrap: wrap; gap: 20rpx; margin-bottom: 30rpx; }
	.option-btn { width: calc(50% - 10rpx); border: 2rpx solid #3b82f6; color: #3b82f6; border-radius: 10rpx; height: 80rpx; display: flex; justify-content: center; align-items: center; font-size: 32rpx; font-weight: bold; }
	.option-btn.active { background: #3b82f6; color: #fff; }
	.custom-input { height: 90rpx; border: 2rpx solid #ddd; border-radius: 10rpx; padding: 0 20rpx; font-size: 30rpx; margin-bottom: 40rpx; }
	.pay-btn { background: #10b981; color: #fff; font-size: 32rpx; border-radius: 45rpx; height: 90rpx; display: flex; align-items: center; justify-content: center; }
	.pay-btn::after { border: none; }
</style>
