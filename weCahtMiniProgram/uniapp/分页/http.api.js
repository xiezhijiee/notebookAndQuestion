/*
 * @Date: 2021-02-02 16:03:32
 * @LastEditors: E'vils
 * @LastEditTime: 2021-03-02 19:04:38
 * @Description: 
 * @FilePath: /common/http.api.js
 */

/**
 * 简历相关api
 */
const imgUpload = "/common/upload"
const install = (Vue, vm) => {
	const createGetApi = (pash) => {
		return (params = {}) => vm.$u.get('run' + pash, params);
	}
	const createPostApi = (pash) => {
		return (params = {}) => vm.$u.post('run' + pash, params);
	}
	// 此处没有使用传入的params参数
	//get

	//post
	// let getYzzzzkzDX = (params = {}) => vm.$u.post(yzzzzkzDX, params); //短信接口

	let uploadImg = (filePath, formData = {}, name = 'file') => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: vm.$u.http.config.baseUrl + imgUpload, //仅为示例，非真实的接口地址
				filePath: filePath,
				name: name,
				header: {
					token: uni.getStorageSync('token')
				},
				formData: formData,
				success: (uploadFileRes) => {
					uploadFileRes.data && resolve(JSON.parse(uploadFileRes.data))
				},
				fail: (error) => {
					reject(error)
				}
			});
		})
	}

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	//put
	vm.$u.api = {
		// 用户相关
		userLogin: createPostApi("/user/login"), //登录/获取用户信息
		userInfo: createGetApi("/user/info"), // 用户基本信息
		applyhorseman: createPostApi("/user/applyhorseman"), //申请成为骑手
		getscore: createPostApi('/user/getscorelist'), //获取积分，用于积分抵扣
		getcouponlist: createPostApi('/coupon/couponlist'), //获取优惠劵列表
		getmoneylist: createPostApi('/user/getmoneylist'), //获取金额明细
		getwallet: createGetApi('/user/getwallet'), //获取钱包信息
		getInvitelist: createPostApi('/user/invitelist'), //获取邀请用户列表
		// 站点相关
		siteInfo: createGetApi("/site/info"), // 获取站点信息
		siteVipInfo: createGetApi("/site/vipinfo"), // 获取站点vip信息
		schoolList: createGetApi("/school/list"), //获取学校列表
		schoolSiteList: createGetApi("/school/campuslistwithsite"), //获取校区列表（带站点）
		SiteList: createGetApi("/site/sitelist"), //获取站点列表
		setDefaultsite: createPostApi("/user/setdefaultsite"), //设置默认站点
		// 订单相关
		orderDetail: createPostApi("/order/info"), // 订单详情
		myorderlist: createPostApi("/order/myorderlist"), // 我的订单列表
		cancelOrder: createPostApi("/order/cancelorder"), // 取消订单(自己)
		cancelorderbyhorseman: createPostApi("/order/cancelorderbyhorseman"), // 取消订单(骑手)
		createOrder: createPostApi("/order/create"), //创建订单
		setOrderStatus: createPostApi("/order/setstatusbyhorseman"), // 设置订单状态（骑手）
		finishOrder: createPostApi("/order/finish"), // 订单完成
		rewardHorseman: createPostApi("/order/reward"), // 打赏
		// 跑腿广场
		serveList: createPostApi("/serve/list"), // 跑腿广场列表
		receiving: createPostApi("/order/receiving"), // 接单
		listbyhorseman: createPostApi("/order/listbyhorseman"), // 我接到的订单
		//图片上传
		imgUpload: "/common/upload",
		uploadImg,
		// 支付
		payOrder: createPostApi("/wx/pay"), // 支付订单
		payReward: createPostApi("/order/reward"), // 支付打赏
		payVip: createPostApi("/order/vip"), // 支付vip
		withdraw: createPostApi("/wx/paytobalance"), // 提现

		//地址相关
		getaddress: createPostApi('/user/getaddress'), //获取收货地址
		setdefaultaddress: createPostApi('/user/setdefaultaddress'), //设置默认收货地址
		editaddress: createPostApi('/user/editaddress'), //新增编辑收货地址
		deladdress: createPostApi('/user/deladdress'), //删除收货地址
		getBuildinglist: createGetApi('/site/buildinglist'), //获取宿舍楼列表
		//积分
		getscorelist: createPostApi('/user/getscorelist'), //获取积分明细
		// /run/user/getscorelist
	};
	// 金额格式化方法
	vm.$u.amountFormat = (num) => {
		if (typeof (num) == "undefined" || typeof (num) == "null") {
			return
		} else {
			let _num = parseFloat(num)
			return _num.toFixed(2)
		}
	}
	// 16进制色彩转RGBA
	vm.$u.sixteenToRGBA = (hex, alpha) => {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		let _RGBA = result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: parseFloat(alpha).toFixed(1),
		} : null;

		return `rgba(${_RGBA.r},${_RGBA.g},${_RGBA.b},${_RGBA.a})`
	}
	// 订单编号加空格隔开
	vm.$u.numFormat = function (v) {
		if (!v) {
			return
		}
		return v.toString().replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 ')
	}
	// 页面模式的api调用
	vm.$u.pagesApi = function ({
		fnName,
		name,
		param = {},
		page = 'page',
		loadStatus = "status",
		refresh = false,
		list = null,
		success
	}, ) {
		console.log(this.xiezhijie)
		if (refresh) {
			this[loadStatus] = "loadmore";
			this[page] = 1;
			this[name] = {
				data: [],
			};
		}
		if (this[loadStatus] == "nomore") {
			return
		}
		this[loadStatus] = "loading";
		this.$u.api[fnName]({
				...param,
				page: this[page]
			})
			.then((v) => {
				uni.stopPullDownRefresh();
				this['triggered'] = false;
				this['_freshing'] = false;
				if (list) { // 进行内容的特别判断,如果值包裹在另外一层
				console.log("上出")
					success(v)
					v = v[list]
				}
				if (this[page] >= v.last_page) {
					this[name].data = [...this[name].data, ...v.data]
					this[loadStatus] = "nomore";
				} else if (this[page] < v.last_page) {
					this[name].data = [...this[name].data, ...v.data]
					this[page]++;
					this[loadStatus] = "loadmore";
				} else {
					this[name].data = [...this[name].data, ...v.data]
					this[loadStatus] = "loadmore";
				}
				if (!list) {
					console.log("底出")
					success(v)
				}
			});
	}
}
export default {
	install
}