<template>
	<view class="page-container">
		<text class="title">个人中心</text>
		<view class="user-info">
			<text class="label">当前登录账号：</text>
			<text class="value">{{ currentUser }}</text>
		</view>
		
		<!-- 个人健康信息 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">个人健康信息</text>
				<button v-if="!isEditing" class="edit-btn" @click="isEditing = true">编辑</button>
			</view>
			
			<view class="health-info-form">
				<view class="form-row">
					<text class="form-label">身高：</text>
					<view v-if="isEditing" class="form-input-wrapper">
						<input type="number" v-model="personalHealthInfo.height" placeholder="请输入身高(cm)" class="form-input" />
					</view>
					<text v-else class="form-value">{{ personalHealthInfo.height || '未设置' }} cm</text>
				</view>
				
				<view class="form-row">
					<text class="form-label">体重：</text>
					<view v-if="isEditing" class="form-input-wrapper">
						<input type="number" v-model="personalHealthInfo.weight" placeholder="请输入体重(kg)" class="form-input" />
					</view>
					<text v-else class="form-value">{{ personalHealthInfo.weight || '未设置' }} kg</text>
				</view>
				
				<view class="form-row">
					<text class="form-label">年龄：</text>
					<view v-if="isEditing" class="form-input-wrapper">
						<input type="number" v-model="personalHealthInfo.age" placeholder="请输入年龄" class="form-input" />
					</view>
					<text v-else class="form-value">{{ personalHealthInfo.age || '未设置' }} 岁</text>
				</view>
				
				<view class="form-row">
					<text class="form-label">性别：</text>
					<view v-if="isEditing" class="form-select-wrapper">
						<picker :range="['', '男', '女']" v-model="personalHealthInfo.gender" class="form-picker">
							<view class="picker-text">{{ personalHealthInfo.gender || '请选择' }}</view>
						</picker>
					</view>
					<text v-else class="form-value">{{ personalHealthInfo.gender || '未设置' }}</text>
				</view>
				
				<view class="form-row">
					<text class="form-label">血型：</text>
					<view v-if="isEditing" class="form-select-wrapper">
						<picker :range="['', 'A型', 'B型', 'O型', 'AB型']" v-model="personalHealthInfo.bloodType" class="form-picker">
							<view class="picker-text">{{ personalHealthInfo.bloodType || '请选择' }}</view>
						</picker>
					</view>
					<text v-else class="form-value">{{ personalHealthInfo.bloodType || '未设置' }}</text>
				</view>
			</view>
			
			<view v-if="isEditing" class="form-actions">
				<button class="save-btn" @click="savePersonalHealthInfo">保存</button>
				<button class="cancel-btn" @click="isEditing = false">取消</button>
			</view>
		</view>
		
		<!-- 个人体检信息 -->
		<view class="section">
			<text class="section-title">个人体检信息</text>
			<view v-if="healthRecords.length === 0" class="empty-tip">
				<text>暂无体检信息</text>
				<navigator url="/pages/checkup_register/checkup_register" class="register-link">去注册健康档案</navigator>
			</view>
			<view v-else class="record-list">
				<view class="record-item" v-for="record in healthRecords" :key="record.id">
					<view class="record-header">
						<text class="record-name">{{ record.name }}</text>
						<text class="record-time">{{ formatTime(record.createTime) }}</text>
					</view>
					<view class="record-content">
						<view class="record-row">
							<text class="record-label">身份证号：</text>
							<text class="record-value">{{ record.idCard }}</text>
						</view>
						<view class="record-row">
							<text class="record-label">联系电话：</text>
							<text class="record-value">{{ record.phone }}</text>
						</view>
						<view class="record-row">
							<text class="record-label">既往病史：</text>
							<text class="record-value">{{ record.medicalHistory }}</text>
						</view>
					</view>
					<view class="record-actions">
						<button class="detail-btn" @click="viewDetail(record)">查看详情</button>
						<button class="delete-btn" @click="deleteRecord(record.id)">删除</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 产科建档信息 -->
		<view class="section">
			<text class="section-title">产科建档信息</text>
			<view v-if="obstetricsRecords.length === 0" class="empty-tip">
				<text>暂无产科建档信息</text>
				<navigator url="/pages/obstetrics/obstetrics" class="register-link">去产科建档</navigator>
			</view>
			<view v-else class="record-list">
				<view class="record-item" v-for="record in obstetricsRecords" :key="record.id">
					<view class="record-header">
						<text class="record-name">{{ record.name }}</text>
						<text class="record-time">{{ formatTime(record.createTime) }}</text>
					</view>
					<view class="record-content">
						<view class="record-row">
							<text class="record-label">末次月经：</text>
							<text class="record-value">{{ record.lastPeriod }}</text>
						</view>
						<view class="record-row">
							<text class="record-label">预产期：</text>
							<text class="record-value">{{ record.dueDate }}</text>
						</view>
					</view>
					<view class="record-actions">
						<button class="detail-btn" @click="viewObstetricsDetail(record)">查看详情</button>
						<button class="delete-btn" @click="deleteObstetricsRecord(record.id)">删除</button>
					</view>
				</view>
			</view>
		</view>
		
		<button class="logout-btn" @click="handleLogout">退出登录</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentUser: '',
			healthRecords: [],
			obstetricsRecords: [],
			personalHealthInfo: {
				height: '',
				weight: '',
				age: '',
				gender: '',
				bloodType: ''
			},
			isEditing: false
		}
	},
	onShow() {
		const storedUser = uni.getStorageSync('current_user');
		this.currentUser = storedUser !== undefined && storedUser !== null ? String(storedUser) : 'test_user';
		this.loadHealthRecords();
		this.loadObstetricsRecords();
		this.loadPersonalHealthInfo();
	},
	methods: {
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
						this.healthRecords = res.result.data || [];
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载健康档案失败', err);
					this.healthRecords = [];
				}
			});
		},
		loadObstetricsRecords() {
			uni.showLoading({ title: '加载�?..' });
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
					console.error('加载产科建档信息失败', err);
					this.obstetricsRecords = [];
				}
			});
		},
		viewDetail(record) {
			// 显示详情
			uni.showModal({
				title: '健康档案详情',
				content: `姓名：${record.name}\n身份证号：${record.idCard}\n联系电话：${record.phone}\n既往病史：${record.medicalHistory}\n创建时间：${this.formatTime(record.createTime)}`,
				showCancel: false
			});
		},
		viewObstetricsDetail(record) {
			// 显示产科建档详情
			uni.showModal({
				title: '产科建档详情',
				content: `姓名：${record.name}\n末次月经：${record.lastPeriod}\n预产期：${record.dueDate}\n创建时间：${this.formatTime(record.createTime)}`,
				showCancel: false
			});
		},
		deleteRecord(id) {
			uni.showModal({
				title: '删除确认',
				content: '确定要删除这条健康档案吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '删除中...' });
						uniCloud.callFunction({
							name: 'uniCloud',
							data: {
								action: 'deleteHealthRecord',
								username: this.currentUser,
								recordId: id
							},
							success: (res) => {
								uni.hideLoading();
								if (res.result.code === 0) {
									uni.showToast({ title: '删除成功', icon: 'success' });
									// 重新加载数据
									this.loadHealthRecords();
								} else {
									uni.showToast({ title: res.result.message, icon: 'none' });
								}
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('删除健康档案失败', err);
								uni.showToast({ title: '删除失败', icon: 'none' });
							}
						});
					}
				}
			});
		},
		deleteObstetricsRecord(id) {
			uni.showModal({
				title: '删除确认',
				content: '确定要删除这条产科建档记录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '删除中...' });
						uniCloud.callFunction({
							name: 'uniCloud',
							data: {
								action: 'deleteObstetricsRecord',
								username: this.currentUser,
								recordId: id
							},
							success: (res) => {
								uni.hideLoading();
								if (res.result.code === 0) {
									uni.showToast({ title: '删除成功', icon: 'success' });
									// 重新加载数据
									this.loadObstetricsRecords();
								} else {
									uni.showToast({ title: res.result.message, icon: 'none' });
								}
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('删除产科建档信息失败', err);
								uni.showToast({ title: '删除失败', icon: 'none' });
							}
						});
					}
				}
			});
		},
		handleLogout() {
			uni.removeStorageSync('current_user');
			uni.reLaunch({ url: '/pages/login/login' });
		},
		formatTime(timeStr) {
			const date = new Date(timeStr);
			return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
		},
		loadPersonalHealthInfo() {
			uni.showLoading({ title: '加载�?..' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'getPersonalHealthInfo',
					username: this.currentUser
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0 && res.result.data) {
						this.personalHealthInfo = { ...this.personalHealthInfo, ...res.result.data };
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('加载个人健康信息失败', err);
				}
			});
		},
		savePersonalHealthInfo() {
			uni.showLoading({ title: '保存中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'savePersonalHealthInfo',
					username: this.currentUser,
					data: this.personalHealthInfo
				},
				success: (res) => {
					uni.hideLoading();
					if (res.result.code === 0) {
						uni.showToast({ title: '保存成功', icon: 'success' });
						this.isEditing = false;
					} else {
						uni.showToast({ title: res.result.message, icon: 'none' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('保存个人健康信息失败', err);
					uni.showToast({ title: '保存失败', icon: 'none' });
				}
			});
		}
	}
}
</script>

<style>
	.page-container { padding: 40rpx; display: flex; flex-direction: column; min-height: 100vh; background-color: #f4f6f8; }
	.title { font-size: 40rpx; font-weight: bold; margin-bottom: 40rpx; margin-top: 40rpx; text-align: center; }
	.user-info { margin-bottom: 40rpx; padding: 20rpx; background: #fff; border-radius: 16rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.label { font-size: 32rpx; color: #666; }
	.value { font-size: 36rpx; font-weight: bold; color: #333; }
	
	.section { margin-bottom: 40rpx; }
	.section-title { font-size: 36rpx; font-weight: bold; margin-bottom: 20rpx; color: #333; }
	.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
	.edit-btn { padding: 0 30rpx; height: 60rpx; line-height: 60rpx; font-size: 28rpx; border-radius: 30rpx; background: #3b82f6; color: #fff; }
	.edit-btn::after { border: none; }
	.empty-tip { text-align: center; padding: 60rpx; background: #fff; border-radius: 16rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.register-link { display: block; margin-top: 20rpx; color: #3b82f6; font-size: 32rpx; }
	
	.record-list { display: flex; flex-direction: column; gap: 20rpx; }
	.record-item { background: #fff; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.record-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; padding-bottom: 20rpx; border-bottom: 2rpx dashed #eee; }
	.record-name { font-size: 32rpx; font-weight: bold; color: #333; }
	.record-time { font-size: 24rpx; color: #999; }
	.record-content { margin-bottom: 20rpx; }
	.record-row { display: flex; margin-bottom: 10rpx; font-size: 28rpx; }
	.record-label { width: 140rpx; color: #666; }
	.record-value { flex: 1; color: #333; }
	.record-actions { display: flex; justify-content: flex-end; gap: 20rpx; }
	.detail-btn { padding: 0 30rpx; height: 60rpx; line-height: 60rpx; font-size: 28rpx; border-radius: 30rpx; background: #3b82f6; color: #fff; }
	.delete-btn { padding: 0 30rpx; height: 60rpx; line-height: 60rpx; font-size: 28rpx; border-radius: 30rpx; background: #f5222d; color: #fff; }
	.detail-btn::after, .delete-btn::after { border: none; }
	
	.logout-btn { width: 100%; height: 90rpx; border-radius: 45rpx; background: #f5222d; color: #fff; display: flex; align-items: center; justify-content: center; margin-top: 40rpx; }
	.logout-btn::after { border: none; }
	
	/* 个人健康信息表单样式 */
	.health-info-form { background: #fff; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.form-row { display: flex; align-items: center; margin-bottom: 24rpx; }
	.form-label { width: 120rpx; font-size: 28rpx; color: #666; }
	.form-value { flex: 1; font-size: 28rpx; color: #333; }
	.form-input-wrapper { flex: 1; }
	.form-input { width: 100%; height: 60rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 0 20rpx; font-size: 28rpx; }
	.form-select-wrapper { flex: 1; }
	.form-picker { width: 100%; height: 60rpx; border: 2rpx solid #eee; border-radius: 8rpx; padding: 0 20rpx; display: flex; align-items: center; }
	.picker-text { font-size: 28rpx; color: #333; }
	.form-actions { display: flex; justify-content: flex-end; gap: 20rpx; margin-top: 30rpx; padding-top: 20rpx; border-top: 2rpx solid #eee; }
	.save-btn { padding: 0 40rpx; height: 68rpx; line-height: 68rpx; font-size: 28rpx; border-radius: 34rpx; background: #10b981; color: #fff; }
	.cancel-btn { padding: 0 40rpx; height: 68rpx; line-height: 68rpx; font-size: 28rpx; border-radius: 34rpx; background: #9ca3af; color: #fff; }
	.save-btn::after, .cancel-btn::after { border: none; }
</style>
