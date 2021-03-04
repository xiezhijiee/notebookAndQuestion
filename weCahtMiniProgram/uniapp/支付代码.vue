<!--
 * @Date: 2021-02-25 15:10:10
 * @LastEditors: E'vils
 * @LastEditTime: 2021-03-01 11:28:36
 * @Description: 支付选择组件内容
 * @FilePath: /components/payChoose/payChoose.vue
-->
<template>
  <view class="">
    <u-popup v-model="show" mode="bottom" height="1000" border-radius="14">
      <view class="u-p-30 u-m-b-30">
        <!-- <text class="ev-title ev-borb ev-fr-c payTitle">支付</text> -->
        <view class="ev-fc-c u-m-t-32">
          <text class="u-font-24 type-info">需支付金额</text>
          <text class="amount u-m-t-8">¥{{ amount }}</text>
        </view>
        <view class="u-m-t-80">
          <view class="ev-fr-sb box" @click="payment(2)">
            <view class="ev-fr-s">
              <image class="ev-icon-64" src="/static/wechatPay.png"></image>
              <text class="u-font-32 f_bold u-m-l-20">微信支付</text>
            </view>
            <u-icon name="arrow-right" size="36" color="#C7C7CB"></u-icon>
          </view>
          <view class="ev-fr-sb box" @click="payment(1)">
            <view class="ev-fr-s">
              <image class="ev-icon-64" src="/static/balancePay.png"></image>
              <view class="u-m-l-20">
                <text class="u-font-32 f_bold">账户支付</text>
                <view class="ev-fr-s u-m-t-12 u-font-24">
                  <text class="type-info">账户余额: ¥{{ money }}</text>
                  <text v-if="money < amount" class="type-error u-m-l-20">余额不足</text>
                </view>
              </view>
            </view>
            <u-icon name="arrow-right" size="36" color="#C7C7CB"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
    <e-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  props: {
    amount: {
      type: Number | String,
      default: "20.00",
    },
    payType: {
      type: Number | String,
      default: 0, // 0 代表订单,1代表打赏,2代表vip
    },
    vipLevel: {
      type: Number | String,
      default: 1,
    },
    payId: {
      type: Number | String,
      default: 0,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  //v-model 控制 显示隐藏
  watch: {
    value: {
      handler(val) {
        this.show = val;
      },
      immediate: true,
    },
    show: {
      handler(val) {
        this.$emit("input", val);
        if (val == true && this.money === null) {
          this.getwallet();
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      show: false,
      money: null,
    };
  },
  methods: {
    // 获取钱包信息
    getwallet() {
      this.$u.api.getwallet().then((v) => {
        this.money = v.money;
      });
    },
    payment(pay_type) {
      this.payOrder(pay_type);
    },
    payOrder(pay_type) {
      this.$u.api
        .payOrder({
          pay_id: this.payId,
          pay_type: pay_type, // 支付方式，1=余额，2=微信在线
        })
        .then((v) => {
          console.log("payOrder :>> ", v);
          this.wechatPayFunc(v);
        });
    },
    wechatPayFunc(v) {
      console.log("v :>> ", v);
      if (v) {
        let { nonceStr, signType, timeStamp, paySign } = v;
        uni.requestPayment({
          provider: "wxpay",
          timeStamp,
          nonceStr,
          package: v.package,
          signType,
          paySign,
          success: (res) => {
            this.$refs.uToast.show({
              title: "支付成功",
              type: "success",
              icon: false,
              callback: () => {},
            });
          },
          fail: (err) => {
            this.$refs.uToast.show({
              title: "支付失败",
              type: "error",
              icon: false,
              callback: () => {},
            });
          },
          complete: () => {
            this.show = false;
            this.$emit("payComplete");
          },
        });
      } else {
        this.show = false;
        this.$emit("payComplete");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payTitle {
  font-size: 40rpx;
}
.amount {
  font-size: 60rpx;
  font-weight: bold;
  line-height: 82rpx;
  color: #141519;
}
.box {
  width: 688rpx;
  height: 150rpx;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 14rpx #f1f1f1;
  border-radius: 26rpx;
  padding: 40rpx;
  margin: 14rpx 0;
}
</style>
