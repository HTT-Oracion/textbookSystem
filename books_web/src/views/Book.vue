<template>
  <div class="book-page">
    <my-bread nameOne="教材管理" nameTwo="教材列表"></my-bread>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getBookList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addBookVisible = true">
            添加教材</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="bookList" border>
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column prop="ISBN" label="ISBN"> </el-table-column>
        <el-table-column prop="book_name" label="书名"> </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="publish" label="出版社"> </el-table-column>
        <el-table-column prop="date" label="出版日期"> </el-table-column>
        <el-table-column prop="price" label="单价" width="50">
        </el-table-column>
        <el-table-column prop="times" label="使用次数" width="100">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scoped">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger" @click="deleteBook">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <add-book
      :addBookVisible="addBookVisible"
      @close="addBookVisible = $event"
      @update="getBookList"
    ></add-book>
  </div>
</template>

<script>
import AddBook from '@/components/AddBook'
import { pageMixin } from '@/mixin'
import { getBooksApi } from '@/api/book'
// import { errorTip, successTip, infoTip } from '@/utils/viewsTool'
export default {
  name: 'Book',
  components: {
    AddBook
  },
  mixins: [pageMixin],
  data () {
    return {
      bookList: [],
      addBookVisible: false
    }
  },
  watch: {
    'queryInfo.pageNum': function (val, oldVal) {
      this.getBookList()
    },
    'queryInfo.pageSize': function (val, oldVal) {
      this.getBookList()
    }
  },
  methods: {
    async getBookList () {
      const { data } = await getBooksApi(this.queryInfo)
      this.bookList = data.result
      this.total = data.total
      console.log(data);
    },
    addBook () { },
    deleteBook () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(111);
        this.$message.success('删除成功!')
        this.getBookList()
      })
    }
  },
  created () {
    this.getBookList()
  }
}
</script>

<style>
</style>