<template>
	<view class="page-container">
		<text class="title">就医反馈</text>
		<view class="feedback-box">
			<text class="label">您对我们的服务满意吗？</text>
			<view class="rating">
				<text class="star" v-for="i in 5" :key="i" :class="{ active: i <= rating }" @click="setRating(i)">
					{{ i <= rating ? '★' : '☆' }}
				</text>
			</view>
			<textarea class="textarea" v-model="feedbackContent" placeholder="请留下您宝贵的意见或建议..."></textarea>
			<button class="submit-btn" @click="handleSubmit">提交反馈</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			rating: 5,
			feedbackContent: '',
			currentUser: ''
		}
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('current_user') || 'test_user';
	},
	methods: {
		setRating(score) {
			this.rating = score;
		},
		handleSubmit() {
			if (!this.feedbackContent.trim()) {
				uni.showToast({ title: '请输入反馈内容', icon: 'none' });
				return;
			}
			
			const feedbackRecord = {
				id: `feedback_${Date.now()}`,
				rating: this.rating,
				content: this.feedbackContent,
				createTime: new Date().toISOString(),
				user: this.currentUser
			};
			
			const storageKey = `feedback_records_${this.currentUser}`;
			let records = uni.getStorageSync(storageKey) || [];
			if (typeof records === 'string') {
				try { records = JSON.parse(records); } catch(e) { records = []; }
			}
			records.push(feedbackRecord);
			uni.setStorageSync(storageKey, JSON.stringify(records));
			
			uni.showToast({ title: '收到反馈，感谢您的宝贵意见！', icon: 'success' });
			
			setTimeout(() => {
				this.rating = 5;
				this.feedbackContent = '';
			}, 1500);
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.feedback-box { background: #fff; border-radius: 16rpx; padding: 40rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.label { font-size: 30rpx; color: #333; font-weight: bold; margin-bottom: 20rpx; display: block; text-align: center; }
	.rating { display: flex; justify-content: center; gap: 20rpx; margin-bottom: 40rpx; }
	.star { font-size: 50rpx; cursor: pointer; }
	.star.active { color: #f59e0b; }
	.textarea { width: 100%; height: 200rpx; background: #f9f9f9; border: 2rpx solid #eee; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; margin-bottom: 40rpx; }
	.submit-btn { background: #3b82f6; color: #fff; font-size: 32rpx; border-radius: 40rpx; height: 80rpx; line-height: 80rpx; }
	.submit-btn::after { border: none; }
</style>
