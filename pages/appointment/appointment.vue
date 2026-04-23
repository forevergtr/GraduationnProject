<template>
	<view class="page-container">
		<!-- 搜索框-->
		<view class="search-bar">
			<input type="text" class="search-input" placeholder="搜索科室或医生姓名" />
			<text class="search-icon">🔍</text>
		</view>

		<!-- 科室和医生列表-->
		<view class="content-area">
			<!-- 左侧科室导航 -->
			<scroll-view scroll-y class="sidebar">
				<view class="sidebar-item" 
					v-for="(dept, index) in departments" 
					:key="index" 
					:class="{ active: currentDept === dept.id }"
					@click="switchDept(dept.id)">
					<text>{{ dept.name }}</text>
				</view>
			</scroll-view>

			<!-- 右侧医生列表 -->
			<scroll-view scroll-y class="main-content">
				<text class="dept-title">{{ getDeptName() }} 医生排班</text>
				
				<view class="doctor-card" v-for="doc in currentDoctors" :key="doc.id">
					<view class="doc-header">
						<view class="avatar">👨‍⚕️</view>
						<view class="info">
							<view class="name-title">
								<text class="name">{{ doc.name }}</text>
								<text class="title">{{ doc.title }}</text>
							</view>
							<text class="desc">擅长：{{ doc.skill }}</text>
						</view>
					</view>
					
					<view class="schedule-list">
						<view class="schedule-item" v-for="(sch, sIndex) in doc.schedules" :key="sIndex">
							<view class="sch-time">
								<text class="date">{{ sch.date }}</text>
								<text class="time">{{ sch.time }}</text>
							</view>
							<view class="sch-action">
								<text class="fee">¥{{ doc.fee }}</text>
								<button class="book-btn" @click="handleBook(doc, sch)">预约</button>
							</view>
						</view>
					</view>
				</view>
				
				<view v-if="currentDoctors.length === 0" class="empty-tip">
					<text>暂无医生排班信息</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentDept: 'internal',
				departments: [
					{ id: 'internal', name: '内科' },
					{ id: 'surgery', name: '外科' },
					{ id: 'pediatrics', name: '儿科' },
					{ id: 'gynecology', name: '妇产科' },
					{ id: 'ent', name: '耳鼻喉科' },
					{ id: 'dermatology', name: '皮肤科' },
					{ id: 'ophthalmology', name: '眼科' },
					{ id: 'dental', name: '口腔科' },
					{ id: 'psychology', name: '精神心理科' },
					{ id: 'traditional', name: '中医科' },
					{ id: 'examination', name: '检查科' }
				],
				doctors: {
					'internal': [
						{ id: 101, name: '李建国', title: '主任医师', skill: '心血管疾病、高血压、冠心病等', fee: 50, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] },
						{ id: 102, name: '张伟', title: '副主任医师', skill: '消化系统疾病、胃肠炎等', fee: 30, schedules: [{ date: '明天', time: '下午 14:00-17:00' }] },
						{ id: 103, name: '王芳', title: '主治医师', skill: '呼吸系统疾病、哮喘、肺炎等', fee: 25, schedules: [{ date: '今天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] }
					],
					'surgery': [
						{ id: 201, name: '王强', title: '主任医师', skill: '普外科常见疾病手术治疗', fee: 50, schedules: [{ date: '明天', time: '上午 08:00-12:00' }] },
						{ id: 202, name: '李强', title: '副主任医师', skill: '骨科疾病、骨折、关节置换等', fee: 45, schedules: [{ date: '今天', time: '下午 14:00-17:00' }, { date: '后天', time: '上午 08:00-12:00' }] },
						{ id: 203, name: '赵军', title: '主治医师', skill: '泌尿外科疾病', fee: 35, schedules: [{ date: '明天', time: '下午 14:00-17:00' }] }
					],
					'pediatrics': [
						{ id: 301, name: '刘芳', title: '主治医师', skill: '小儿呼吸道感染、发热等', fee: 20, schedules: [{ date: '今天', time: '下午 14:00-17:00' }, { date: '明天', time: '上午 08:00-12:00' }] },
						{ id: 302, name: '陈医生', title: '副主任医师', skill: '小儿消化系统疾病、营养不良等', fee: 25, schedules: [{ date: '明天', time: '下午 14:00-17:00' }, { date: '后天', time: '上午 08:00-12:00' }] }
					], 
					'gynecology': [
						{ id: 401, name: '张医生', title: '主任医师', skill: '妇科炎症、月经不调等', fee: 40, schedules: [{ date: '今天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] },
						{ id: 402, name: '李医生', title: '主治医师', skill: '产科保健、产前检查等', fee: 30, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] }
					],
					'ent': [
						{ id: 501, name: '王医生', title: '副主任医师', skill: '鼻炎、咽炎、中耳炎等', fee: 35, schedules: [{ date: '今天', time: '下午 14:00-17:00' }, { date: '明天', time: '上午 08:00-12:00' }] },
						{ id: 502, name: '赵医生', title: '主治医师', skill: '耳鸣、听力下降等', fee: 30, schedules: [{ date: '明天', time: '下午 14:00-17:00' }, { date: '后天', time: '下午 14:00-17:00' }] }
					],
					'dermatology': [
						{ id: 601, name: '刘医生', title: '主任医师', skill: '湿疹、皮炎、痤疮等', fee: 40, schedules: [{ date: '今天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] },
						{ id: 602, name: '陈医生', title: '主治医师', skill: '皮肤过敏、荨麻疹等', fee: 30, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] }
					],
					'ophthalmology': [
						{ id: 701, name: '李医生', title: '主任医师', skill: '白内障、青光眼等', fee: 45, schedules: [{ date: '今天', time: '下午 14:00-17:00' }, { date: '明天', time: '下午 14:00-17:00' }] },
						{ id: 702, name: '王医生', title: '主治医师', skill: '近视、远视、散光等', fee: 30, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] }
					],
					'dental': [
						{ id: 801, name: '张医生', title: '副主任医师', skill: '龋齿、牙周病等', fee: 35, schedules: [{ date: '今天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] },
						{ id: 802, name: '赵医生', title: '主治医师', skill: '牙齿矫正、种植牙等', fee: 50, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] }
					],
					'psychology': [
						{ id: 901, name: '刘医生', title: '主任医师', skill: '抑郁症、焦虑症等', fee: 60, schedules: [{ date: '今天', time: '下午 14:00-17:00' }, { date: '明天', time: '下午 14:00-17:00' }] },
						{ id: 902, name: '陈医生', title: '主治医师', skill: '心理咨询、心理疏导等', fee: 40, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] }
					],
					'traditional': [
						{ id: 1001, name: '王医生', title: '主任医师', skill: '中医内科、针灸推拿等', fee: 45, schedules: [{ date: '今天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] },
						{ id: 1002, name: '李医生', title: '主治医师', skill: '中医妇科、调理养生等', fee: 35, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] }
					],
					'examination': [
						{ id: 1101, name: '入职入学体检', title: '检查类别', skill: '适用于入职、入学等常规体检', fee: 150, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] },
						{ id: 1102, name: '个人健康体检', title: '检查类别', skill: '全面的个人健康状况评估', fee: 300, schedules: [{ date: '明天', time: '上午 08:00-12:00' }, { date: '后天', time: '下午 14:00-17:00' }] },
						{ id: 1103, name: '中老年体检', title: '检查类别', skill: '针对中老年人的专项体检', fee: 450, schedules: [{ date: '今天', time: '上午 08:00-12:00' }, { date: '后天', time: '上午 08:00-12:00' }] },
						{ id: 1104, name: '妇女专项体检', title: '检查类别', skill: '针对女性的专项体检', fee: 350, schedules: [{ date: '明天', time: '下午 14:00-17:00' }, { date: '后天', time: '下午 14:00-17:00' }] }
					]
				}
			}
		},
		computed: {
			currentDoctors() {
				return this.doctors[this.currentDept] || [];
			}
		},
		methods: {
			switchDept(id) {
				this.currentDept = id;
			},
			getDeptName() {
				const dept = this.departments.find(d => d.id === this.currentDept);
				return dept ? dept.name : '';
			},
			handleBook(doc, sch) {
				const storedUser = uni.getStorageSync('current_user');
				const currentUser = storedUser !== undefined && storedUser !== null ? String(storedUser) : '';
				if (!currentUser) {
					uni.showToast({ title: '请先登录', icon: 'none' });
					setTimeout(() => { uni.navigateTo({ url: '/pages/login/login' }); }, 1000);
					return;
				}
				
				uni.showModal({
					title: '确认预约',
					content: `确认预约 ${this.getDeptName()} ${doc.name} 医生？\n时间：${sch.date} ${sch.time}\n挂号费：¥${doc.fee}`,
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({ title: '预约中...' });
							
							const newRecord = {
								deptName: this.getDeptName(),
								doctorName: doc.name,
								date: sch.date,
								time: sch.time,
								fee: doc.fee,
								status: 'upcoming',
								createTime: new Date().toISOString()
							};
							
							uniCloud.callFunction({
								name: 'uniCloud',
								data: {
									action: 'saveAppointment',
									username: currentUser,
									data: newRecord
								},
								success: (res) => {
									uni.hideLoading();
									if (res.result.code === 0) {
										uni.showToast({ title: '预约成功', icon: 'success' });
										setTimeout(() => {
											uni.navigateTo({ url: '/pages/record/record' });
										}, 1500);
									} else {
										uni.showToast({ title: res.result.message, icon: 'none' });
									}
								},
								fail: (err) => {
									uni.hideLoading();
									console.error('预约失败', err);
									uni.showToast({ title: '预约失败', icon: 'none' });
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
	
	.search-bar { background: #fff; padding: 20rpx 30rpx; display: flex; align-items: center; position: relative; border-bottom: 2rpx solid #eee; }
	.search-input { flex: 1; height: 70rpx; background: #f5f5f5; border-radius: 35rpx; padding: 0 80rpx 0 30rpx; font-size: 28rpx; }
	.search-icon { position: absolute; right: 50rpx; color: #999; font-size: 36rpx; }
	
	.content-area { display: flex; flex: 1; overflow: hidden; }
	
	.sidebar { width: 200rpx; background: #f9f9f9; height: 100%; border-right: 2rpx solid #eee; }
	.sidebar-item { height: 100rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #666; position: relative; }
	.sidebar-item.active { background: #fff; color: #3b82f6; font-weight: bold; }
	.sidebar-item.active::before { content: ''; position: absolute; left: 0; top: 20rpx; bottom: 20rpx; width: 8rpx; background: #3b82f6; border-radius: 0 8rpx 8rpx 0; }
	
	.main-content { flex: 1; padding: 20rpx; height: 100%; box-sizing: border-box; }
	.dept-title { font-size: 32rpx; font-weight: bold; color: #333; margin-bottom: 20rpx; display: block; }
	
	.doctor-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.doc-header { display: flex; margin-bottom: 20rpx; padding-bottom: 20rpx; border-bottom: 2rpx dashed #eee; }
	.avatar { width: 90rpx; height: 90rpx; border-radius: 50%; background: #e6f7ff; display: flex; justify-content: center; align-items: center; font-size: 50rpx; margin-right: 20rpx; flex-shrink: 0; }
	.info { flex: 1; }
	.name-title { margin-bottom: 8rpx; }
	.name { font-size: 32rpx; font-weight: bold; color: #333; margin-right: 16rpx; }
	.title { font-size: 24rpx; color: #fff; background: #f59e0b; padding: 2rpx 10rpx; border-radius: 6rpx; }
	.desc { font-size: 24rpx; color: #666; display: block; line-height: 1.4; }
	
	.schedule-list { display: flex; flex-direction: column; gap: 16rpx; }
	.schedule-item { display: flex; justify-content: space-between; align-items: center; background: #f9fafb; padding: 16rpx; border-radius: 8rpx; }
	.sch-time { display: flex; flex-direction: column; }
	.date { font-size: 28rpx; color: #333; font-weight: bold; margin-bottom: 4rpx; }
	.time { font-size: 24rpx; color: #666; }
	.sch-action { display: flex; align-items: center; }
	.fee { font-size: 30rpx; color: #f5222d; font-weight: bold; margin-right: 20rpx; }
	.book-btn { background: #3b82f6; color: #fff; font-size: 26rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; padding: 0 30rpx; margin: 0; }
	
	.empty-tip { text-align: center; color: #999; font-size: 28rpx; margin-top: 100rpx; }
</style>
