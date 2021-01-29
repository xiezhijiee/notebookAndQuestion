# 微信小程序开发问题

## 引入腾讯视频插件（uniapp）

![image-20201207150541818](C:\Users\xiezhijie\AppData\Roaming\Typora\typora-user-images\image-20201207150541818.png)



![image-20201207150613327](C:\Users\xiezhijie\AppData\Roaming\Typora\typora-user-images\image-20201207150613327.png)

![image-20210120162527417](C:\Users\xiezhijie\AppData\Roaming\Typora\typora-user-images\image-20210120162527417.png)

![image-20210120162541922](C:\Users\xiezhijie\AppData\Roaming\Typora\typora-user-images\image-20210120162541922.png)

## 头部下拉颜色渐变

	onPageScroll(e) {
		let opacity = 0
		let color=255
		    if(e.scrollTop <= 200){
		      opacity = e.scrollTop / 200
			  color=255 - 16*e.scrollTop
			  if(e.scrollTop==0){
				  color=255
			  }
		    }else{
				color=0 
		      opacity = 1
		    }	
			
		let str = "rgba(255,255,255,"+ opacity +")"
		this.titleColor = `rgba(${color},${color},${color},1)`
		
		this.background.backgroundColor=str
		},
## 富文本样式

	setRichText(html){
				if(html){
					html= html.replace(/<p>/ig, "<p style='display: flex;align-items: center;'><span>.</span>")
					html= html.replace('<img ', '<img style="max-width:100%;height:auto;display:block;"')
					return html
				}
			
			},
encodeURIComponent(JSON.stringify(item))



## 关于获取小程序码wxacode.getUnlimited

https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html



```js
	//获取到

if (option.scene) {
			let btem = decodeURIComponent(option.scene);
			let newarr = btem.split('&');
			let allEarr = [];
			newarr.forEach(item => {
				let c = item.split('=');
				allEarr.push(c);
			});
			this.projectId = allEarr[0][1];
			this.$store.state.pi_id = allEarr[0][1];
			this.refreshpage(allEarr[0][1]);
		}
```

