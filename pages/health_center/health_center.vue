<template>
	<view class="page-container">
		<text class="title">健康管理中心</text>

		<!-- 健康数据记录 -->
		<view class="section">
			<text class="section-title">健康数据记录</text>
			<view class="data-input">
				<text class="label">体重 (kg)：</text>
				<input type="number" v-model="weight" placeholder="请输入体重" />
				<button class="add-btn" @click="addWeightRecord">记录</button>
			</view>
		</view>

		<!-- 近期体重趋势 -->
		<view class="section">
			<text class="section-title">近期体重趋势 (kg)</text>
			<view class="chart-placeholder" v-if="weightRecords.length === 0">
				<text>暂无数据，记录体重后查看趋势</text>
			</view>
			<view class="weight-list" v-else>
				<view class="weight-item" v-for="(record, index) in weightRecords" :key="index">
					<text class="date">{{ record.date }}</text>
					<text class="value">{{ record.weight }} kg</text>
				</view>
			</view>
		</view>

		<!-- 健康档案信息 -->
		<view class="section">
			<text class="section-title">健康档案信息</text>
			<view v-if="healthRecords.length === 0" class="empty-tip">
				<text>暂无健康档案</text>
				<navigator url="/pages/checkup_register/checkup_register" class="link">去注册健康档案</navigator>
			</view>
			<view v-else class="record-list">
				<view class="record-item" v-for="record in healthRecords" :key="record.id">
					<text class="record-name">{{ record.name }}</text>
					<text class="record-time">{{ formatTime(record.createTime) }}</text>
				</view>
			</view>
		</view>

		<!-- 近期预约记录 -->
		<view class="section">
			<text class="section-title">近期预约记录</text>
			<view v-if="appointments.length === 0" class="empty-tip">
				<text>暂无预约记录</text>
				<navigator url="/pages/appointment/appointment" class="link">去预约挂号</navigator>
			</view>
			<view v-else class="record-list">
				<view class="record-item" v-for="appointment in appointments" :key="appointment.id">
					<text class="record-name">{{ appointment.deptName }} - {{ appointment.doctorName }}</text>
					<text class="record-time">{{ appointment.date }} {{ appointment.time }}</text>
				</view>
			</view>
		</view>

		<!-- 产科建档信息 -->
		<view class="section">
			<text class="section-title">产科建档信息</text>
			<view v-if="obstetricsRecords.length === 0" class="empty-tip">
				<text>暂无产科建档信息</text>
				<navigator url="/pages/obstetrics/obstetrics" class="link">去产科建档</navigator>
			</view>
			<view v-else class="record-list">
				<view class="record-item" v-for="record in obstetricsRecords" :key="record.id">
					<text class="record-name">{{ record.name }}</text>
					<text class="record-time">预产期：{{ record.dueDate }}</text>
				</view>
			</view>
		</view>

		<!-- 今日健康建议 -->
		<view class="section">
			<text class="section-title">今日健康建议</text>
			<view class="health-tips">
				<text class="tips-content" v-for="(tip, index) in healthTips" :key="index">{{ index + 1 }}. {{ tip }}\n</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentUser: '',
			weight: '',
			weightRecords: [],
			healthRecords: [],
			appointments: [],
			obstetricsRecords: [],
			healthTips: [
				'每天保持至少 30 分钟的有氧运动',
				'饮食清淡，多吃蔬菜水果',
				'保证充足睡眠，早睡早起',
				'保持心情愉悦，避免过度压力',
				'定期体检，关注健康状况'
			]
		}
	},
	onShow() {
		this.currentUser = uni.getStorageSync('current_user') || 'test_user';
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadWeightRecords();
			this.loadHealthRecords();
			this.loadAppointments();
			this.loadObstetricsRecords();
		},
		loadWeightRecords() {
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getWeightRecords',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.weightRecords = res.result.data.slice(-7).reverse();
					}
				},
				fail: (err) => {
					uni.hideLoading();
					this.weightRecords = [];
				}
			});
		},
		loadHealthRecords() {
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getHealthRecords',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.healthRecords = res.result.data.slice(0, 3);
					}
				},
				fail: (err) => {
					uni.hideLoading();
					this.healthRecords = [];
				}
			});
		},
		loadAppointments() {
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
						this.appointments = res.result.data.slice(0, 3);
					}
				},
				fail: (err) => {
					uni.hideLoading();
					this.appointments = [];
				}
			});
		},
		loadObstetricsRecords() {
			uni.showLoading({ title: '加载中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getObstetricsRecords',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						this.obstetricsRecords = res.result.data || [];
					}
				},
				fail: (err) => {
					uni.hideLoading();
					this.obstetricsRecords = [];
				}
			});
		},
		addWeightRecord() {
			if (!this.weight) {
				uni.showToast({ title: '请输入体重', icon: 'none' });
				return;
			}

			const weightRecord = {
				date: new Date().toLocaleDateString(),
				weight: this.weight
			};

			uni.showLoading({ title: '保存中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'saveWeightRecord',
					username: this.currentUser,
					data: weightRecord
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						uni.showToast({ title: '记录成功', icon: 'success' });
						this.weight = '';
						this.loadWeightRecords();
					} else {
						uni.showToast({ title: res.result.message, icon: 'none' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({ title: '保存失败', icon: 'none' });
				}
			});
		},
		formatTime(timeStr) {
			const date = new Date(timeStr);
			return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; text-align: center; }

	.section { background: #fff; padding: 30rpx; border-radius: 16rpx; margin-bottom: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.section-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 20rpx; display: block; }

	.data-input { display: flex; align-items: center; gap: 20rpx; }
	.data-input .label { font-size: 28rpx; color: #666; width: 120rpx; }
	.data-input input { flex: 1; height: 60rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 0 20rpx; font-size: 28rpx; }
	.add-btn { background: #3b82f6; color: #fff; font-size: 28rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; padding: 0 30rpx; margin: 0; }
	.add-btn::after { border: none; }

	.chart-placeholder { height: 300rpx; background: #fafafa; display: flex; align-items: center; justify-content: center; color: #999; border-radius: 10rpx; font-size: 28rpx; }

	.weight-list { display: flex; flex-direction: column; gap: 10rpx; }
	.weight-item { display: flex; justify-content: space-between; padding: 15rpx; background: #f9fafb; border-radius: 8rpx; }
	.weight-item .date { font-size: 28rpx; color: #666; }
	.weight-item .value { font-size: 28rpx; font-weight: bold; color: #333; }

	.empty-tip { text-align: center; padding: 40rpx; color: #999; font-size: 28rpx; }
	.link { display: block; margin-top: 20rpx; color: #3b82f6; font-size: 28rpx; }

	.record-list { display: flex; flex-direction: column; gap: 15rpx; }
	.record-item { padding: 20rpx; background: #f9fafb; border-radius: 8rpx; }
	.record-item .record-name { display: block; font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 5rpx; }
	.record-item .record-time { display: block; font-size: 24rpx; color: #666; }

	.health-tips { padding: 20rpx; background: #f9fafb; border-radius: 8rpx; }
	.tips-content { font-size: 28rpx; color: #666; line-height: 1.8; }
</style>
