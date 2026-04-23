<template>
	<view class="page-container">
		<text class="title">体检预约</text>
		<view class="pkg-list">
			<view class="pkg-card" v-for="pkg in packages" :key="pkg.id">
				<text class="pkg-name">{{ pkg.name }}</text>
				<text class="pkg-price">¥ {{ pkg.price.toFixed(2) }}</text>
				<text class="pkg-desc">{{ pkg.desc }}</text>
				<button class="book-btn" @click="handleBook(pkg)">立即预约</button>
			</view>
		</view>
		
		<view class="modal" v-if="showModal">
			<view class="modal-content">
				<text class="modal-title">预约{{ selectedPackage?.name }}</text>
				
				<view class="form-item">
					<text class="form-label">选择日期</text>
					<picker mode="date" :start="minDate" :end="maxDate" v-model="appointmentDate" class="form-picker">
						<text>{{ appointmentDate }}</text>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="form-label">选择时间</text>
					<picker mode="time" :start="'08:00'" :end="'17:00'" v-model="appointmentTime" class="form-picker">
						<text>{{ appointmentTime }}</text>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="form-label">联系电话</text>
					<input class="form-input" type="number" placeholder="请输入联系电话" v-model="contactPhone" />
				</view>
				
				<view class="modal-actions">
					<button class="modal-btn cancel-btn" @click="showModal = false">取消</button>
					<button class="modal-btn confirm-btn" @click="confirmAppointment">确认预约</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			packages: [
				{
					id: 1,
					name: '基础健康体检套餐',
					price: 399,
					desc: '适合各年龄段人群的基础健康筛查，包含血常规、肝肾功能、心电图等'
				},
				{
					id: 2,
					name: '深度防癌体检套餐',
					price: 1299,
					desc: '全面深入的防癌筛查，包含各类肿瘤标志物、全身彩超等高级项目'
				}
			],
			showModal: false,
			selectedPackage: null,
			appointmentDate: '',
			appointmentTime: '',
			contactPhone: '',
			minDate: '',
			maxDate: '',
			currentUser: ''
		}
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('current_user');
		const today = new Date();
		const maxDate = new Date();
		maxDate.setDate(today.getDate() + 30);
		this.minDate = this.formatDate(today);
		this.maxDate = this.formatDate(maxDate);
		this.appointmentDate = this.minDate;
		this.appointmentTime = '09:00';
	},
	methods: {
		handleBook(pkg) {
			this.selectedPackage = pkg;
			this.showModal = true;
		},
		confirmAppointment() {
			if (!this.contactPhone) {
				uni.showToast({ title: '请输入联系电话', icon: 'none' });
				return;
			}
			
			const appointment = {
				packageId: this.selectedPackage.id,
				packageName: this.selectedPackage.name,
				price: this.selectedPackage.price,
				date: this.appointmentDate,
				time: this.appointmentTime,
				contactPhone: this.contactPhone,
				status: 'pending',
				createTime: new Date().toISOString()
			};
			
			uni.showLoading({ title: '预约中...' });
			uniCloud.callFunction({
				name: 'uniCloud',
				data: {
					action: 'saveAppointment',
					username: this.currentUser,
					data: {
						deptName: '体检中心',
						doctorName: '体检医生',
						...appointment
					}
				},
				success: (res) => {
					if (res.result.code === 0) {
						const paymentItem = {
							type: 'checkup',
							deptName: '体检中心',
							doctorName: '体检医生',
							amount: this.selectedPackage.price,
							status: 'pending',
							createTime: new Date().toISOString()
						};
						
						uniCloud.callFunction({
							name: 'uniCloud',
							data: {
								action: 'savePayment',
								username: this.currentUser,
								data: paymentItem
							},
							success: (res) => {
								uni.hideLoading();
								if (res.result.code === 0) {
									this.showModal = false;
									uni.showToast({ title: '预约成功，请前往缴费', icon: 'success' });
								} else {
									uni.hideLoading();
									uni.showToast({ title: res.result.message, icon: 'none' });
								}
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('创建缴费记录失败', err);
								uni.showToast({ title: '预约失败', icon: 'none' });
							}
						});
					} else {
						uni.hideLoading();
						uni.showToast({ title: res.result.message, icon: 'none' });
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('保存预约记录失败', err);
					uni.showToast({ title: '预约失败', icon: 'none' });
				}
			});
		},
		formatDate(date) {
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.pkg-card { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.pkg-name { font-size: 32rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
	.pkg-price { font-size: 36rpx; color: #f5222d; font-weight: bold; display: block; margin-bottom: 10rpx; }
	.pkg-desc { font-size: 26rpx; color: #666; display: block; margin-bottom: 20rpx; line-height: 1.5; }
	.book-btn { background: #3b82f6; color: #fff; font-size: 28rpx; border-radius: 40rpx; }
	.book-btn::after { border: none; }
	
	.modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999; }
	.modal-content { background: #fff; border-radius: 20rpx; padding: 40rpx; width: 80%; max-width: 500rpx; }
	.modal-title { font-size: 32rpx; font-weight: bold; margin-bottom: 30rpx; display: block; text-align: center; }
	.form-item { margin-bottom: 30rpx; }
	.form-label { font-size: 28rpx; color: #333; margin-bottom: 10rpx; display: block; }
	.form-picker { height: 80rpx; border: 2rpx solid #ddd; border-radius: 10rpx; padding: 0 20rpx; display: flex; align-items: center; font-size: 28rpx; }
	.form-input { height: 80rpx; border: 2rpx solid #ddd; border-radius: 10rpx; padding: 0 20rpx; font-size: 28rpx; }
	.modal-actions { display: flex; gap: 20rpx; margin-top: 40rpx; }
	.modal-btn { flex: 1; height: 80rpx; font-size: 28rpx; border-radius: 40rpx; }
	.cancel-btn { background: #f5f5f5; color: #666; border: 2rpx solid #ddd; }
	.confirm-btn { background: #3b82f6; color: #fff; }
	.modal-btn::after { border: none; }
</style>
