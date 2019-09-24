// components/goodsTab/index.js
Component({
  properties: {
    titleList: {
      type: Array,
      value:[]
    },
    currentIndex: {
      type: Number,
      value:0
    }
  },
  methods: {
    handleTap(e) {
      const index = e.target.dataset.index
      this.triggerEvent("changeIndex", {index})
    }
  }
})
