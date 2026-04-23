<template>
	<view class="page-container">
		<text class="title">线上问诊</text>
		<view class="doctor-list" v-if="!showChat">
			<view class="doctor-card" v-for="doctor in doctors" :key="doctor.id">
				<view class="avatar">{{ doctor.avatar }}</view>
				<view class="info">
					<text class="name">{{ doctor.name }}</text>
					<text class="dept">{{ doctor.dept }} {{ doctor.title }}</text>
					<text class="desc">擅长：{{ doctor.specialty }}</text>
				</view>
				<button class="ask-btn" @click="startConsult(doctor)">图文问诊</button>
			</view>
		</view>
		
		<view class="chat-container" v-else>
			<view class="chat-header">
				<text class="back-btn" @click="showChat = false">返回</text>
				<view class="chat-info">
					<text class="chat-name">{{ currentDoctor?.name }}</text>
					<text class="chat-status">{{ currentDoctor?.dept }} {{ currentDoctor?.title }}</text>
				</view>
			</view>
			
			<view class="chat-body">
				<view class="message-list" ref="messageList">
					<view class="message doctor-message" v-for="(msg, index) in messages" :key="index">
						<view class="message-avatar">{{ msg.type === 'doctor' ? currentDoctor?.avatar : '👤' }}</view>
						<view class="message-content" :class="msg.type">
							<text>{{ msg.content }}</text>
							<text class="message-time">{{ msg.time }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="chat-footer">
				<input class="chat-input" type="text" placeholder="请输入您的问题..." v-model="inputMessage" />
				<button class="send-btn" @click="sendMessage">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			doctors: [
				{
					id: 1,
					name: '李医生',
					dept: '内科',
					title: '主任医师',
					specialty: '常见内科疾病，高血压，糖尿病等',
					avatar: '👨‍⚕️'
				},
				{
					id: 2,
					name: '王医生',
					dept: '外科',
					title: '副主任医师',
					specialty: '普外科手术，微创手术',
					avatar: '👩‍⚕️'
				},
				{
					id: 3,
					name: '张医生',
					dept: '儿科',
					title: '主治医师',
					specialty: '儿童常见疾病，生长发育等',
					avatar: '🧑‍⚕️'
				}
			],
			showChat: false,
			currentDoctor: null,
			messages: [],
			inputMessage: '',
			currentUser: ''
		}
	},
	onLoad() {
		this.currentUser = uni.getStorageSync('current_user');
	},
	methods: {
		startConsult(doctor) {
			this.currentDoctor = doctor;
			this.showChat = true;
			this.messages = [
				{
					type: 'doctor',
					content: `您好，我是${doctor.name}，请问有什么可以帮助您的？`,
					time: this.formatTime(new Date())
				}
			];
			this.createPaymentItem(doctor);
		},
		sendMessage() {
			if (!this.inputMessage.trim()) return;
			
			this.messages.push({
				type: 'user',
				content: this.inputMessage,
				time: this.formatTime(new Date())
			});
			
			this.inputMessage = '';
			
			this.scrollToBottom();
			
			setTimeout(() => {
				const reply = this.getSmartReply(this.messages[this.messages.length - 1].content);
				this.messages.push({
					type: 'doctor',
					content: reply,
					time: this.formatTime(new Date())
				});
				this.scrollToBottom();
			}, 1000);
		},
		getSmartReply(message) {
			const symptoms = {
				'感冒': {
					synonyms: ['感冒', '伤风', '受凉', '风寒'],
					reply: '感冒是常见的上呼吸道感染，建议多休息，多喝水，保持室内通风。如果症状严重，可以服用感冒药缓解症状。如果发烧超过38.5℃或症状持续超过3天，建议及时就医。'
				},
				'发烧': {
					synonyms: ['发烧', '发热', '体温高', '高烧', '低烧'],
					reply: '发烧是身体对抗感染的一种反应。如果体温不超过38.5℃，可以采用物理降温，如温水擦浴。如果体温超过38.5℃，可以服用退烧药。如果发烧持续超过3天或伴有其他严重症状，建议及时就医。'
				},
				'肚子痛': {
					synonyms: ['肚子痛', '腹痛', '胃痛', '肚子疼', '腹部不适'],
					reply: '肚子痛可能由多种原因引起，如消化不良、胃炎、肠炎等。建议暂时禁食或清淡饮食，避免辛辣刺激性食物。如果疼痛剧烈或持续时间较长，建议及时就医。'
				},
				'头痛': {
					synonyms: ['头痛', '头疼', '脑袋疼', '头部不适'],
					reply: '头痛可能由多种原因引起，如紧张性头痛、偏头痛、感冒等。建议休息，保持充足的睡眠，避免过度劳累。如果头痛剧烈或伴有其他症状，如恶心、呕吐、视力模糊等，建议及时就医。'
				},
				'咳嗽': {
					synonyms: ['咳嗽', '咳', '干咳', '咳痰'],
					reply: '咳嗽是身体清除呼吸道分泌物的一种反射。如果是干咳，可以服用镇咳药；如果有痰，建议服用祛痰药。如果咳嗽持续超过2周或伴有其他症状，如发热、呼吸困难等，建议及时就医。'
				},
				'流鼻涕': {
					synonyms: ['流鼻涕', '鼻塞', '鼻子不通', '鼻水'],
					reply: '流鼻涕是感冒或过敏的常见症状。建议多喝水，保持鼻腔清洁，可以使用生理盐水滴鼻液缓解症状。如果症状持续时间较长或伴有其他症状，建议及时就医。'
				},
				'喉咙痛': {
					synonyms: ['喉咙痛', '嗓子疼', '咽痛', '喉咙不适'],
					reply: '喉咙痛可能由感冒、咽喉炎等引起。建议多喝水，避免辛辣刺激性食物，可以含服润喉糖或喉片缓解症状。如果疼痛剧烈或伴有其他症状，如发热、吞咽困难等，建议及时就医。'
				},
				'恶心': {
					synonyms: ['恶心', '想吐', '反胃', '作呕'],
					reply: '恶心可能由多种原因引起，如消化不良、胃炎、食物中毒等。建议暂时禁食或清淡饮食，避免油腻食物。如果恶心伴有呕吐、腹痛等症状，建议及时就医。'
				},
				'呕吐': {
					synonyms: ['呕吐', '吐', '吐奶', '喷射性呕吐'],
					reply: '呕吐可能由多种原因引起，如消化不良、胃炎、食物中毒等。建议暂时禁食，待症状缓解后逐渐恢复饮食。如果呕吐频繁或伴有其他症状，如发热、腹痛等，建议及时就医。'
				},
				'腹泻': {
					synonyms: ['腹泻', '拉肚子', '拉稀', '水样便'],
					reply: '腹泻可能由多种原因引起，如肠炎、食物中毒等。建议多喝水，避免脱水，可以服用止泻药。如果腹泻频繁或伴有其他症状，如发热、腹痛等，建议及时就医。'
				},
				'失眠': {
					synonyms: ['失眠', '睡不着', '睡眠不好', '熬夜'],
					reply: '失眠可能由多种原因引起，如压力大、焦虑、环境因素等。建议保持规律的作息时间，睡前避免使用电子设备，创造安静舒适的睡眠环境。如果失眠严重影响日常生活，建议咨询医生。'
				},
				'疲劳': {
					synonyms: ['疲劳', '乏力', '没精神', '浑身无力'],
					reply: '疲劳可能由多种原因引起，如过度劳累、睡眠不足、贫血等。建议保证充足的睡眠，合理饮食，适当运动。如果疲劳持续时间较长，建议就医检查。'
				},
				'过敏': {
					synonyms: ['过敏', '过敏性鼻炎', '荨麻疹', '皮肤过敏'],
					reply: '过敏是免疫系统对某些物质的过度反应。建议避免接触过敏原，保持室内清洁，使用空气净化器。如果过敏症状严重，建议服用抗过敏药物或就医。'
				}
			};
			
			for (const [symptom, data] of Object.entries(symptoms)) {
				for (const synonym of data.synonyms) {
					if (message.includes(synonym)) {
						return data.reply;
					}
				}
			}
			
			const detectedSymptoms = [];
			for (const [symptom, data] of Object.entries(symptoms)) {
				for (const synonym of data.synonyms) {
					if (message.includes(synonym)) {
						detectedSymptoms.push(symptom);
						break;
					}
				}
			}
			
			if (detectedSymptoms.length > 1) {
				return `您提到了${detectedSymptoms.join('、')}等症状，这些可能是相关联的。建议您多休息，保持良好的生活习惯。如果症状持续或加重，建议及时就医。`;
			}
			
			const emergencyKeywords = ['胸痛', '呼吸困难', '剧烈头痛', '严重腹痛', '高烧不退', '意识不清', '出血不止'];
			for (const keyword of emergencyKeywords) {
				if (message.includes(keyword)) {
					return '您描述的症状可能比较严重，建议立即就医或拨打急救电话。';
				}
			}
			
			return '请详细描述您的症状，以便我更好地为您诊断。';
		},
		scrollToBottom() {
			setTimeout(() => {
				const messageList = this.$refs.messageList;
				if (messageList) {
					messageList.scrollTop = messageList.scrollHeight;
				}
			}, 100);
		},
		createPaymentItem(doctor) {
			const paymentItem = {
				id: `payment_${Date.now()}`,
				type: 'online_consult',
				deptName: doctor.dept,
				doctorName: doctor.name,
				amount: 50,
				status: 'pending',
				createTime: new Date().toISOString()
			};
			
			const paymentStorageKey = `payments_${this.currentUser}`;
			let payments = uni.getStorageSync(paymentStorageKey) || [];
			if (typeof payments === 'string') {
				try { payments = JSON.parse(payments); } catch(e) { payments = []; }
			}
			payments.push(paymentItem);
			uni.setStorageSync(paymentStorageKey, JSON.stringify(payments));
		},
		formatTime(date) {
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		}
	}
}
</script>

<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; }
	.doctor-card { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; display: flex; align-items: center; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.avatar { font-size: 80rpx; margin-right: 20rpx; background: #e6f7ff; border-radius: 50%; width: 100rpx; height: 100rpx; display: flex; justify-content: center; align-items: center; }
	.info { flex: 1; display: flex; flex-direction: column; }
	.name { font-size: 32rpx; font-weight: bold; color: #333; }
	.dept { font-size: 24rpx; color: #666; margin: 6rpx 0; }
	.desc { font-size: 22rpx; color: #999; }
	.ask-btn { font-size: 24rpx; background: #3b82f6; color: #fff; border-radius: 30rpx; padding: 0 20rpx; height: 60rpx; line-height: 60rpx; margin-left: 20rpx; }
	.ask-btn::after { border: none; }
	
	.chat-container { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #f4f6f8; z-index: 999; }
	.chat-header { background: #fff; padding: 20rpx 30rpx; display: flex; align-items: center; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.back-btn { font-size: 36rpx; margin-right: 20rpx; color: #333; }
	.chat-info { flex: 1; }
	.chat-name { font-size: 32rpx; font-weight: bold; color: #333; display: block; }
	.chat-status { font-size: 24rpx; color: #666; display: block; }
	.chat-body { flex: 1; padding: 30rpx; overflow-y: auto; height: calc(100vh - 240rpx); }
	.message-list { display: flex; flex-direction: column; gap: 20rpx; }
	.message { display: flex; align-items: flex-start; }
	.message-avatar { font-size: 40rpx; margin-right: 15rpx; background: #e6f7ff; border-radius: 50%; width: 60rpx; height: 60rpx; display: flex; justify-content: center; align-items: center; }
	.message-content { max-width: 70%; padding: 15rpx 20rpx; border-radius: 16rpx; position: relative; }
	.message-content.doctor { background: #e6f7ff; color: #333; border-bottom-left-radius: 4rpx; }
	.message-content.user { background: #3b82f6; color: #fff; border-bottom-right-radius: 4rpx; margin-left: auto; }
	.message-time { font-size: 20rpx; opacity: 0.6; display: block; margin-top: 5rpx; text-align: right; }
	.chat-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 30rpx; display: flex; align-items: center; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05); }
	.chat-input { flex: 1; height: 60rpx; border: 2rpx solid #ddd; border-radius: 30rpx; padding: 0 20rpx; font-size: 28rpx; margin-right: 20rpx; }
	.send-btn { background: #3b82f6; color: #fff; border-radius: 30rpx; padding: 0 30rpx; height: 60rpx; line-height: 60rpx; font-size: 28rpx; }
	.send-btn::after { border: none; }
</style>
