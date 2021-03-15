export const pageMixin = {
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 5
      },
      total: 0
    }
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
    }
  }
}