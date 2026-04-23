<template>
	<view class="page-container">
		<text class="title">就诊指引</text>
		<view class="step-list">
			<view class="step-item" v-for="(step, index) in steps" :key="index">
				<view class="step-num">{{ index + 1 }}</view>
				<view class="step-info">
					<text class="step-name">{{ step.name }}</text>
					<text class="step-desc">{{ step.desc }}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				steps: [
				{ name: '门诊大厅导诊', desc: '进入大厅，可在一楼服务台咨询导诊护士' },
				{ name: '自助挂号/取号', desc: '前往大厅左侧自助终端机进行挂号或取号' },
				{ name: '前往科室候诊', desc: '根据挂号单提示，前往对应楼层科室等候区等待叫号' },
				{ name: '医生看诊', desc: '叫号后进入诊室，由医生进行专业看诊' },
				{ name: '就诊后缴费', desc: '看诊结束后，请及时通过手机或自助终端机完成缴费' },
				{ name: '取药', desc: '缴费完成后，前往一楼药房取药' }
			]
			}
		}
	}
</script>
<style>
	.page-container { padding: 30rpx; background: #f4f6f8; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 40rpx; display: block; }
	.step-item { display: flex; margin-bottom: 40rpx; align-items: flex-start; }
	.step-num { width: 60rpx; height: 60rpx; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 30rpx; flex-shrink: 0; }
	.step-info { flex: 1; background: #fff; padding: 20rpx; border-radius: 16rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
	.step-name { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 10rpx; display: block; }
	.step-desc { font-size: 26rpx; color: #666; line-height: 1.5; display: block; }
</style>
