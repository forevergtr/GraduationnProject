<template>
	<view class="page-container">
		<text class="title">每日清单</text>
		<view class="date-selector">
			<text class="arrow" @click="prevDay"><</text>
			<text class="date">{{ formatDate(currentDate) }}</text>
			<text class="arrow" @click="nextDay">></text>
		</view>
		<view class="list-container">
			<view class="list-item" v-for="(item, index) in dailyItems" :key="index">
				<view class="item-header">
					<text class="item-name">{{ item.name }}</text>
					<text class="item-price">¥ {{ item.price.toFixed(2) }}</text>
				</view>
				<text class="item-detail">{{ item.detail }}</text>
			</view>
			<view v-if="dailyItems.length === 0" class="empty-state">
				<text>当天无费用记录</text>
			</view>
		</view>
		<view class="total-bar">
			<text>今日总计</text>
			<text class="total-amount">¥ {{ totalAmount.toFixed(2) }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentDate: new Date(),
			dailyItems: [],
			totalAmount: 0
		}
	},
	watch: {
		currentDate: {
			handler() {
				this.generateDailyItems();
			},
			immediate: true
		}
	},
	methods: {
		formatDate(date) {
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${year}年${month}月${day}日`;
		},
		prevDay() {
			const prevDate = new Date(this.currentDate);
			prevDate.setDate(prevDate.getDate() - 1);
			this.currentDate = prevDate;
		},
		nextDay() {
			const nextDate = new Date(this.currentDate);
			nextDate.setDate(nextDate.getDate() + 1);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const nextDateOnly = new Date(nextDate);
			nextDateOnly.setHours(0, 0, 0, 0);
			if (nextDateOnly <= today) {
				this.currentDate = nextDate;
			}
		},
		generateDailyItems() {
			const day = this.currentDate.getDate();
			const daySeed = day % 7;
			
			const itemTypes = [
				{
					name: '葡萄糖注射液 (500ml)',
					price: 15.50,
					detail: '规格：500ml | 数量：1 | 科室：住院部'
				},
				{
					name: '一次性使用注射器',
					price: 2.00,
					detail: '规格：10ml | 数量：1 | 科室：住院部'
				},
				{
					name: '二级护理',
					price: 50.00,
					detail: '规格：天 | 数量：1 | 科室：住院部'
				},
				{
					name: '血常规检查',
					price: 35.00,
					detail: '规格：次 | 数量：1 | 科室：检验科'
				},
				{
					name: '尿常规检查',
					price: 25.00,
					detail: '规格：次 | 数量：1 | 科室：检验科'
				},
				{
					name: '心电图检查',
					price: 45.00,
					detail: '规格：次 | 数量：1 | 科室：心电图室'
				},
				{
					name: '胸部X光检查',
					price: 80.00,
					detail: '规格：次 | 数量：1 | 科室：放射科'
				},
				{
					name: '氯化钠注射液 (250ml)',
					price: 10.50,
					detail: '规格：250ml | 数量：1 | 科室：住院部'
				},
				{
					name: '维生素C注射液',
					price: 5.00,
					detail: '规格：10ml | 数量：1 | 科室：住院部'
				},
				{
					name: '一级护理',
					price: 80.00,
					detail: '规格：天 | 数量：1 | 科室：住院部'
				}
			];
			
			let items = [];
			let total = 0;
			
			const baseItems = itemTypes.slice(0, 3);
			items = items.concat(baseItems);
			total += baseItems.reduce((sum, item) => sum + item.price, 0);
			
			if (daySeed >= 1) {
				const extraItem1 = itemTypes[3 + (daySeed - 1) % (itemTypes.length - 3)];
				items.push(extraItem1);
				total += extraItem1.price;
			}
			
			if (daySeed >= 3) {
				const extraItem2 = itemTypes[5 + (daySeed - 3) % (itemTypes.length - 5)];
				items.push(extraItem2);
				total += extraItem2.price;
			}
			
			if (daySeed >= 5) {
				const extraItem3 = itemTypes[7 + (daySeed - 5) % (itemTypes.length - 7)];
				items.push(extraItem3);
				total += extraItem3.price;
			}
			
			this.dailyItems = items;
			this.totalAmount = total;
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; padding-bottom: 120rpx; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.date-selector { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 20rpx 40rpx; border-radius: 16rpx; margin-bottom: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.date { font-size: 32rpx; font-weight: bold; color: #333; }
	.arrow { font-size: 36rpx; color: #999; padding: 0 20rpx; }
	.arrow:active { color: #3b82f6; }
	.list-container { background: #fff; border-radius: 16rpx; padding: 0 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.empty-state { padding: 60rpx 0; text-align: center; color: #999; font-size: 28rpx; }
	.list-item { padding: 30rpx 0; border-bottom: 2rpx solid #eee; }
	.list-item:last-child { border-bottom: none; }
	.item-header { display: flex; justify-content: space-between; margin-bottom: 10rpx; }
	.item-name { font-size: 30rpx; color: #333; font-weight: bold; }
	.item-price { font-size: 30rpx; color: #f5222d; font-weight: bold; }
	.item-detail { font-size: 24rpx; color: #888; display: block; }
	.total-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 100rpx; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 0 40rpx; box-shadow: 0 -4rpx 10rpx rgba(0,0,0,0.05); font-size: 32rpx; color: #333; font-weight: bold; }
	.total-amount { color: #f5222d; font-size: 36rpx; }
</style>
