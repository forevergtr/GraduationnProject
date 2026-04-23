<template>
	<view class="page-container">
		<text class="title">出院结算</text>
		<view class="summary-card">
			<text class="label">本次住院总费用</text>
			<text class="amount">¥ {{ formatAmount(totalCost) }}</text>
			<view class="details">
				<view class="detail-row">
					<text>医保统筹支付</text>
					<text>¥ {{ formatAmount(medicalInsurance) }}</text>
				</view>
				<view class="detail-row">
					<text>个人自付</text>
					<text>¥ {{ formatAmount(personalPayment) }}</text>
				</view>
				<view class="detail-row highlight">
					<text>已交预交金</text>
					<text>¥ {{ formatAmount(prepaidAmount) }}</text>
				</view>
			</view>
			<view class="result">
				<text>结算结果</text>
				<text :class="resultClass">{{ resultText }}</text>
			</view>
		</view>
		<button class="confirm-btn" @click="handleSettlement">确认结算</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			totalCost: 8450,
			medicalInsurance: 5000,
			personalPayment: 3450,
			prepaidAmount: 5000,
			currentUser: ''
		}
	},
	computed: {
		resultAmount() {
			return this.prepaidAmount - this.personalPayment;
		},
		resultText() {
			if (this.resultAmount > 0) {
				return `需退款 ¥ ${this.formatAmount(this.resultAmount)}`;
			} else if (this.resultAmount < 0) {
				return `需补交 ¥ ${this.formatAmount(Math.abs(this.resultAmount))}`;
			} else {
				return '无需退款或补交';
			}
		},
		resultClass() {
			if (this.resultAmount > 0) {
				return 'refund';
			} else if (this.resultAmount < 0) {
				return 'payment';
			} else {
				return 'neutral';
			}
		}
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('current_user');
		this.loadPrepaidAmount();
	},
	methods: {
		loadPrepaidAmount() {
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
						this.prepaidAmount = res.result.data || 0;
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载预交金余额失败', err);
					this.prepaidAmount = 0;
				}
			});
		},
		handleSettlement() {
			uni.showModal({
				title: '结算确认',
				content: `确认出院结算？\n${this.resultText}`,
				success: (res) => {
					if (res.confirm) {
						if (this.resultAmount < 0) {
							const amountToPay = Math.abs(this.resultAmount);
							this.createPaymentItem(amountToPay);
							uni.showToast({ title: '结算成功，已生成待缴费项', icon: 'success' });
						} else {
							uni.showToast({ title: '结算成功', icon: 'success' });
						}
					}
				}
			});
		},
		createPaymentItem(amount) {
			const paymentItem = {
				type: 'discharge',
				deptName: '住院部',
				doctorName: '住院医生',
				amount: amount,
				status: 'pending',
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
	.summary-card { background: #fff; border-radius: 20rpx; padding: 40rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); margin-bottom: 40rpx; }
	.label { font-size: 28rpx; color: #666; display: block; text-align: center; margin-bottom: 10rpx; }
	.amount { font-size: 60rpx; font-weight: bold; color: #333; display: block; text-align: center; margin-bottom: 40rpx; }
	.details { border-top: 2rpx dashed #eee; border-bottom: 2rpx dashed #eee; padding: 30rpx 0; margin-bottom: 30rpx; }
	.detail-row { display: flex; justify-content: space-between; font-size: 28rpx; color: #666; margin-bottom: 20rpx; }
	.detail-row:last-child { margin-bottom: 0; }
	.highlight { color: #3b82f6; font-weight: bold; }
	.result { display: flex; justify-content: space-between; font-size: 32rpx; font-weight: bold; color: #333; align-items: center; }
	.refund { color: #10b981; font-size: 36rpx; }
	.payment { color: #f5222d; font-size: 36rpx; }
	.neutral { color: #333; font-size: 36rpx; }
	.confirm-btn { background: #3b82f6; color: #fff; font-size: 32rpx; border-radius: 45rpx; height: 90rpx; display: flex; align-items: center; justify-content: center; }
	.confirm-btn::after { border: none; }
</style>
