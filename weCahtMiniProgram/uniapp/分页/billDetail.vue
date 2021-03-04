<!--
 * @Date: 2021-02-22 11:43:58
 * @LastEditors: E'vils
 * @LastEditTime: 2021-03-01 18:27:25
 * @Description: 账单明细
 * @FilePath: /pages/myCenter/billDetail/billDetail.vue
-->
<template>
  <view class="ev-mainBody u-m-t-20">
    <view class="ev-mainName"> 账单明细 </view>
    <NoContent v-if="billDetail.data.length == 0" />
    <view v-else class="detailBox u-m-t-40">
      <view
        class="ev-fr-sb u-m-t-30 u-m-b-30"
        v-for="(item, idx) in billDetail.data"
        :key="idx"
      >
        <view class="ev-fc-sb">
          <text class="f_bold">{{ item.memo }}</text>
          <text class="u-m-t-16 u-font-24 type-tips">{{
            $u.timeFormat(item.createtime, "yyyy年mm月dd日")
          }}</text>
        </view>
        <view class="ev-fc-e">
          <text class="f_bold u-font-36" :class="item.sorts ? 'negative' : 'positive'">{{
            $u.amountFormat(item.money)
          }}</text>
          <!-- <text v-if="item.poundage" class="u-m-t-16 u-font-24 type-tips"
            >已扣除手续费¥ {{ item.poundage }}</text
          > -->
          <!-- <text v-else class="u-m-t-16 u-font-24 type-tips">余额 {{ item.balance }}</text> -->
        </view>
      </view>
    </view>
    <u-loadmore v-if="billDetail.data.length > 5" :status="status" />
  </view>
</template>

<script>
export default {
  data() {
    return {
		xiezhijie:'xzjduile',
      status: "loadmore",
      page: 1,
      billDetail: {
        data: [],
      },
    };
  },
  onLoad: function () {
    this.getmoneylist();
  },
  onPullDownRefresh: function () {
    this.getmoneylist(true);
  },
  onReachBottom: function () {
    if (this.status == "nomore") return;
    this.getmoneylist();
  },
  methods: {
    getmoneylist(refresh) {
      this.$u.pagesApi.call(this, {
        fnName: "getmoneylist",
        name: "billDetail",
        page: "page",
        param: {},
        refresh,
        success: (v) => {
          this.integral = v.score;
          console.log("this :>>>>>船只 ", v);
        },
      });
      // this.status = "loading";
      // this.$u.api
      //   .getmoneylist({
      //     pages,
      //   })
      //   .then((v) => {
      //     uni.stopPullDownRefresh();
      //     this.integral = v.score;
      //     if (pages == v.last_page) {
      //       this.billDetail = v.data;
      //       this.status = "nomore";
      //       return;
      //     } else if (pages < v.last_page) {
      //       this.billDetail.push(v.data);
      //       this.pages++;
      //     } else {
      //       this.billDetail = v.data;
      //     }
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
.integralNum {
  font-size: 48rpx;
  font-weight: bold;
  line-height: 65rpx;
  color: $main-color;
  margin-left: 14rpx;
}

.positive {
  color: $main-color;
  &::before {
    content: "+";
    font-weight: normal;
    font-size: 28rpx;
  }
}
.negative {
  color: $type-info;
  &::before {
    content: "-";
    font-weight: normal;
    font-size: 28rpx;
  }
}
</style>
