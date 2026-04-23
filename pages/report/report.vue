<template>
	<view class="page-container">
		<text class="title">检验检查</text>
		
		<view v-if="checkupRecords.length === 0" class="empty-tip">
			<text>暂无检查记录</text>
		</view>
		
		<view v-else class="record-list">
			<view class="record-item" v-for="record in checkupRecords" :key="record.id || record._id">
				<view class="item-header">
					<text class="checkup-type">{{ record.type }}</text>
					<text class="status-text" :class="record.status">
						{{ record.status === 'pending' ? '待检查' : '已完成' }}
					</text>
				</view>
				
				<view class="item-content">
					<view class="info-row">
						<text class="label">检查金额：</text>
						<text class="value amount">¥{{ record.amount }}</text>
					</view>
					<view class="info-row">
						<text class="label">预约时间：</text>
						<text class="value">{{ formatTime(record.createTime) }}</text>
					</view>
				</view>
				
				<view class="item-actions" v-if="record.status === 'pending'">
					<button class="check-btn" @click="handleCheck(record.id || record._id)">去检查</button>
				</view>
				<view class="item-actions" v-else>
					<button class="report-btn" @click="viewReport(record.id || record._id)">查看报告</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentUser: '',
			checkupRecords: [],
			personalHealthInfo: {
				height: '',
				weight: '',
				age: '',
				gender: '',
				bloodType: ''
			}
		}
	},
	onShow() {
		const storedUser = uni.getStorageSync('current_user');
		this.currentUser = storedUser !== undefined && storedUser !== null ? String(storedUser) : 'test_user';
		this.loadCheckupRecords();
		this.loadPersonalHealthInfo();
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
					console.error('加载体检记录失败', err);
					this.checkupRecords = [];
				}
			});
		},
		handleCheck(id) {
			uni.showModal({
				title: '确认检查',
				content: '确认已完成检查？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' });
						uniCloud.callFunction({
							name: 'uniCloud',
							data: {
								action: 'updateCheckupRecord',
								username: this.currentUser,
								recordId: id,
								data: { status: 'completed' }
							},
							success: (res) => {
								uni.hideLoading();
								if (res.result.code === 0) {
									uni.showToast({ title: '检查完成', icon: 'success' });
									this.loadCheckupRecords();
								} else {
									uni.showToast({ title: res.result.message, icon: 'none' });
								}
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('更新检查状态失败', err);
								uni.showToast({ title: '操作失败', icon: 'none' });
							}
						});
					}
				}
			});
		},
		viewReport(id) {
			const record = this.checkupRecords.find(r => (r.id === id || r._id === id));
			if (!record) {
				uni.showToast({ title: '找不到检查记录', icon: 'none' });
				return;
			}
			
			let bmi = '';
			let bmiStatus = '';
			if (this.personalHealthInfo.height && this.personalHealthInfo.weight) {
				const heightM = this.personalHealthInfo.height / 100;
				bmi = (this.personalHealthInfo.weight / (heightM * heightM)).toFixed(2);
				if (bmi < 18.5) {
					bmiStatus = '偏瘦';
				} else if (bmi < 24) {
					bmiStatus = '正常';
				} else if (bmi < 28) {
					bmiStatus = '超重';
				} else {
					bmiStatus = '肥胖';
				}
			}
			
			let reportContent = `检查类型：${record.type}\n`;
			reportContent += `检查时间：${this.formatTime(record.createTime)}\n`;
			reportContent += `检查金额：¥${record.amount}\n\n`;
			reportContent += `【个人基本信息】\n`;
			reportContent += `姓名：${this.currentUser}\n`;
			reportContent += `性别：${this.personalHealthInfo.gender || '未设置'}\n`;
			reportContent += `年龄：${this.personalHealthInfo.age || '未设置'} 岁\n`;
			reportContent += `身高：${this.personalHealthInfo.height || '未设置'} cm\n`;
			reportContent += `体重：${this.personalHealthInfo.weight || '未设置'} kg\n`;
			reportContent += `血型：${this.personalHealthInfo.bloodType || '未设置'}\n`;
			
			if (bmi) {
				reportContent += `BMI指数：${bmi} (${bmiStatus})\n`;
			}
			
			reportContent += `\n【检查结果】\n`;
			
			switch (record.type) {
				case '入职入学体检':
					reportContent += `1. 一般检查：正常\n`;
					reportContent += `2. 血常规：正常\n`;
					reportContent += `3. 尿常规：正常\n`;
					reportContent += `4. 肝功能：正常\n`;
					reportContent += `5. 肾功能：正常\n`;
					reportContent += `6. 心电图：正常\n`;
					reportContent += `7. 胸部X光：正常\n\n`;
					reportContent += `【结论】\n`;
					reportContent += `体检结果正常，适合入职/入学。\n`;
					reportContent += `建议：保持良好的生活习惯，定期体检。`;
					break;
				case '个人健康检查':
					reportContent += `1. 一般检查：正常\n`;
					reportContent += `2. 血常规：正常\n`;
					reportContent += `3. 尿常规：正常\n`;
					reportContent += `4. 肝功能：正常\n`;
					reportContent += `5. 肾功能：正常\n`;
					reportContent += `6. 血脂：正常\n`;
					reportContent += `7. 血糖：正常\n`;
					reportContent += `8. 心电图：正常\n`;
					reportContent += `9. 胸部X光：正常\n`;
					reportContent += `10. 腹部B超：正常\n\n`;
					reportContent += `【结论】\n`;
					reportContent += `健康状况良好。\n`;
					reportContent += `建议：继续保持健康的生活方式，合理饮食，适量运动。`;
					break;
				case '中老年体检':
					reportContent += `1. 一般检查：正常\n`;
					reportContent += `2. 血常规：正常\n`;
					reportContent += `3. 尿常规：正常\n`;
					reportContent += `4. 肝功能：正常\n`;
					reportContent += `5. 肾功能：正常\n`;
					reportContent += `6. 血脂：正常\n`;
					reportContent += `7. 血糖：正常\n`;
					reportContent += `8. 心电图：正常\n`;
					reportContent += `9. 胸部X光：正常\n`;
					reportContent += `10. 腹部B超：正常\n`;
					reportContent += `11. 骨密度：正常\n`;
					reportContent += `12. 肿瘤标志物：正常\n\n`;
					reportContent += `【结论】\n`;
					reportContent += `健康状况良好。\n`;
					reportContent += `建议：定期体检，保持适量运动，注意补钙。`;
					break;
				case '妇女专项体检':
					reportContent += `1. 一般检查：正常\n`;
					reportContent += `2. 血常规：正常\n`;
					reportContent += `3. 尿常规：正常\n`;
					reportContent += `4. 肝功能：正常\n`;
					reportContent += `5. 肾功能：正常\n`;
					reportContent += `6. 血脂：正常\n`;
					reportContent += `7. 血糖：正常\n`;
					reportContent += `8. 心电图：正常\n`;
					reportContent += `9. 胸部X光：正常\n`;
					reportContent += `10. 腹部B超：正常\n`;
					reportContent += `11. 乳腺检查：正常\n`;
					reportContent += `12. 妇科检查：正常\n\n`;
					reportContent += `【结论】\n`;
					reportContent += `健康状况良好。\n`;
					reportContent += `建议：定期进行妇科检查，保持健康的生活方式。`;
					break;
				default:
					reportContent += `检查结果：正常\n\n`;
					reportContent += `【结论】\n`;
					reportContent += `检查结果正常。\n`;
					reportContent += `建议：保持健康的生活方式。`;
			}
			
			uni.showModal({
				title: '检查报告',
				content: reportContent,
				showCancel: false
			});
		},
		saveCheckupRecords() {
			const storageKey = `checkup_records_${this.currentUser}`;
			uni.setStorageSync(storageKey, JSON.stringify(this.checkupRecords));
		},
		formatTime(timeStr) {
			const date = new Date(timeStr);
			return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
		},
		loadPersonalHealthInfo() {
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getPersonalHealthInfo',
					username: this.currentUser
				},
				success: (res) => {
					if (res.result.code === 0 && res.result.data) {
						this.personalHealthInfo = { ...this.personalHealthInfo, ...res.result.data };
					}
				},
				fail: (err) => {
					console.error('加载个人健康信息失败', err);
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
	
	.record-list { margin-top: 20rpx; }
	
	.record-item { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	
	.item-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2rpx dashed #eee; padding-bottom: 20rpx; margin-bottom: 20rpx; }
	.checkup-type { font-size: 32rpx; font-weight: bold; color: #333; }
	.status-text { font-size: 28rpx; font-weight: bold; }
	.status-text.pending { color: #f59e0b; }
	.status-text.completed { color: #10b981; }
	
	.item-content { display: flex; flex-direction: column; gap: 16rpx; }
	.info-row { display: flex; font-size: 28rpx; }
	.label { color: #666; width: 140rpx; }
	.value { color: #333; flex: 1; }
	.value.amount { color: #f5222d; font-weight: bold; }
	
	.item-actions { margin-top: 30rpx; padding-top: 20rpx; border-top: 2rpx solid #eee; display: flex; justify-content: flex-end; }
	.check-btn, .report-btn { margin: 0; padding: 0 40rpx; height: 68rpx; line-height: 68rpx; font-size: 28rpx; border-radius: 34rpx; color: #fff; }
	.check-btn { background: #1890ff; }
	.report-btn { background: #10b981; }
	.check-btn::after, .report-btn::after { border: none; }
</style>
