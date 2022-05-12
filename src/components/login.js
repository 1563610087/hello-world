import axios from 'axios'

export function weChatAuthorize(data) {
	return axios({
		method: 'get',
		url: 'http://dwt.yellowrifle.icu:9090/wx/code',
		data: data
	})

}

function getUsersInfo(data){
	return axios({
		method: 'get',
		url: 'http://dwt.yellowrifle.icu:9090/wx/getUserInfo',
		data: data
	})
}

// 获取 uri 中携带的参数
export function getUrlParam(url, name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	const search = url.split('?')[1]
	if (search) {
		var r = search.substr(0).match(reg)
		if (r !== null) return unescape(r[2]).split('#')[0]
		return null
	} else {
		return null
	}
}

export function debounceIm(fn, interval) {
	let timer
	const gapTime = interval || 1000 // 间隔时间，如果interval不传，则默认1000ms
	return function (args) {
		timer && clearTimeout(timer)
		const context = this
		const callNow = !timer
		timer = setTimeout(function () {
			timer = null
		}, gapTime)

		if (callNow) fn.call(context, args)
	}
}

// 判断是否为微信浏览器
export function isWeiXin() {
	const ua = window.navigator.userAgent.toLowerCase()
	return ua.match(/MicroMessenger/i) == 'micromessenger'
}

/**
 * 跳转微信授权页面，获取微信 code
 * @param {*} config 微信授权参数
 */
export function getWxCode(config) {
	const url = encodeURIComponent(config.url) // 回调域名，注意一定要encodeURIComponent
	const appId = config.appId
	const loginWay = config.loginWay
	const state = config.state
	// 跳转至授权页面
	window.location.href =
		`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=${loginWay}&state=${state}#wechat_redirect`
}

/**
 * 调用后端接口，获取用户信息及token
 * 注意防抖，否则短时间内触发两次会导致40163
 */
export const wxAuthorize = debounceIm(function (config) {
	const params = {
		code: config.code,
		appid: config.appId
	}
	console.log(config.code)
	weChatAuthorize(params)
		.then(({
			result,
			code,
			message
		}) => {
			// 请求后端拿到登录信息，前端处理存token
			console.log("你是")
			console.log(result)
			sessionStorage.token=result
			const params = {
				token:result
			}
			getUserInfo(params).then((res) => {
				sessionStorage.username=res.data.userName
			})

		})
		.finally(() => {
			localStorage.setItem('code', '') // 清除code
		})
}, 500)

// 页面初始化时调用的登录函数，检测本地未登录就调用
export function wxLogin(appId, href = window.location.href) {
	// 微信登录配置信息
	const config = {
		appId,
		url: href,
		loginWay: 'snsapi_base',
		state: '',
		code: getUrlParam(window.location.href, 'code') // 从uri中获取的code只能使用一次，五分钟后自动过期
	}
	console.log(config)
	if (config.code) {
		wxAuthorize(config) // 调用后端接口，获取用户信息及 token
	} else {
		getWxCode(config) // 跳转至微信授权页面，获取 code
	}
}
