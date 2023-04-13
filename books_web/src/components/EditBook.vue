<template>
  <el-dialog
    title="编辑教材"
    :visible.sync="editVisible"
    width="50%"
    :show-close="false"
    @close="$emit('close')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="editBookRef" :model="currentBook" label-width="100px">
      <el-form-item prop="ISBN" label="isbn编号：">
        <el-input v-model="currentBook.ISBN" disabled></el-input>
      </el-form-item>
      <el-form-item prop="book_name" label="书名：">
        <el-input v-model="currentBook.book_name" disabled></el-input>
      </el-form-item>
      <el-form-item prop="author" label="作者：">
        <el-input v-model="currentBook.author"></el-input>
      </el-form-item>
      <el-form-item prop="publish" label="出版社：">
        <el-input v-model="currentBook.publish"></el-input>
      </el-form-item>
      <el-form-item prop="date" label="出版日期：">
        <el-input v-model="currentBook.date"></el-input>
      </el-form-item>
      <el-form-item prop="price" label="单价(元)：">
        <el-input v-model.number="currentBook.price"></el-input>
      </el-form-item>
      <el-form-item prop="category" label="类别：">
        <el-input v-model.number="currentBook.categoryId" disabled></el-input>
      </el-form-item>
      <el-form-item prop="nums" label="余量">
        <el-input v-model.number="currentBook.nums"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="btns">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirmEditBook">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCatesApi, editBookApi } from '@/api/book'
export default {
  name: 'EditBook',
  props: {
    currentBook: Object,
    editVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      categories: []
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    async getCategories () {
      const { data } = await getCatesApi()
      this.categories = data.result
      console.log(this.currentBook);
    },
    async confirmEditBook () {
      const { data } = await editBookApi(this.currentBook.id, this.currentBook)
      if (data.status === 200) {
        this.$message.success('修改成功!')
        this.$emit('close')
        this.$emit('update')
      } else {
        this.$message.error('修改失败!')
        this.$emit('close')
      }
    }
  }
}
</script>

<style>
</style>