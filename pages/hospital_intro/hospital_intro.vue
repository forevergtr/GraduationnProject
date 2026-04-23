<template>
	<view class="page-container">
		<text class="title">医院简介</text>
		<view class="content">
			<image class="banner" src="" style="background-color: #d1d5db;"></image>
			<text class="desc">本院是一所集医疗、教学、科研、预防保健为一体的三级综合性公立医院。医院依托雄厚的科研和教学实力，致力于为广大市民提供优质、高效、便捷的医疗服务。</text>
		</view>
	</view>
</template>
<style>
	.page-container { padding: 30rpx; background: #fff; min-height: 100vh; }
	.title { font-size: 36rpx; font-weight: bold; margin-bottom: 30rpx; display: block; text-align: center; }
	.banner { width: 100%; height: 360rpx; border-radius: 16rpx; margin-bottom: 30rpx; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 28rpx; }
	.banner::after { content: '医院大楼实景图'; }
	.desc { font-size: 30rpx; color: #444; line-height: 1.8; text-indent: 60rpx; display: block; }
</style>
