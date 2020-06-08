//app.js
App({
  onLaunch: function() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var Phone=wx.getStorageSync("phone")||"";
    this.globalData.Phone = Phone;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    //
  },
  initSocket() {
    let that = this
    that.globalData.localSocket = wx.connectSocket({
      // url: 'wss://test.enzhico.net/app'
      url: `ws://192.168.1.228:8080/websocket/mina/${that.globalData.Phone}`
    })
    that.globalData.localSocket.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.shift();
        that.sendSocketMessage(msg);
      }
    })
    that.globalData.localSocket.onMessage(function (res) {
      console.log("websocket on message",res);
      that.globalData.callback(res)
    })
    that.globalData.localSocket.onError(function (res) {
      console.log('readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onClose(function (res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
      that.initSocket()
    })
  },
  //统一发送消息
  sendSocketMessage: function (msg) {
    if (this.globalData.localSocket.readyState === 1) {
      this.globalData.localSocket.send({
        data: JSON.stringify(msg)
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },
  onShow: function (options) {
    if (this.globalData.localSocket.readyState !== 0 && this.globalData.localSocket.readyState !== 1) {
      console.log('开始尝试连接WebSocket！readyState=' + this.globalData.localSocket.readyState)
      this.initSocket()
    }
  },
  globalData: {
    localSocket: {},
    callback: function () { },
    Phone:"",
    RefundReason:[
      '数量拍错了',
      '收货地址拍错',
      '暂时不需要了',
      '其他'
    ],
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})