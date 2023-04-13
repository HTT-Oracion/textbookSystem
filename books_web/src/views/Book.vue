<template>
  <div class="book-page">
    <el-card>
      <my-bread nameOne="教材管理" nameTwo="教材列表"></my-bread>
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
          <el-button type="primary" @click="toAdd">添加教材</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="bookList" border stripe>
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
            <el-button type="primary" @click="toEdit(scoped.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteBook(scoped.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <add-book
      :addBookVisible="addBookVisible"
      @close="addBookVisible = false"
      @update="getBookList"
    ></add-book>
    <edit-book
      :editBookVisible="editBookVisible"
      :currentBook="currentBook"
      @close="editBookVisible = false"
      @update="getBookList"
    ></edit-book>
  </div>
</template>

<script>
import AddBook from "@/components/AddBook";
import EditBook from "@/components/EditBook";
import { pageMixin } from "@/mixin";
import { getBooksApi, getBookById, deleteBookApi } from "@/api/book";
// import { errorTip, successTip, infoTip } from '@/utils/viewsTool'
export default {
  name: "Book",
  components: {
    AddBook,
    EditBook
  },
  mixins: [pageMixin],
  data() {
    return {
      bookList: [],
      currentBook: {},
      addBookVisible: false,
      editBookVisible: false
    };
  },
  watch: {
    "queryInfo.pageNum": function(val, oldVal) {
      this.getBookList();
    },
    "queryInfo.pageSize": function(val, oldVal) {
      this.getBookList();
    }
  },
  methods: {
    async getBookList() {
      const { data } = await getBooksApi(this.queryInfo);
      this.bookList = data.result;
      this.total = data.total;
      console.log(data);
    },
    addBook() {},
    async toEdit(id) {
      const { data } = await getBookById(id);
      this.currentBook = data.result;
      this.editBookVisible = true;
    },
    deleteBook(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data } = await deleteBookApi(id);
        if (data.status === 200) {
          this.$message.success("删除成功!");
          this.getBookList();
        } else {
          this.$message.error("删除失败!");
        }
      });
    },
    closeDialog() {
      this.addVisible = false;
      this.editVisible = false;
    }
  },
  created() {
    this.getBookList();
  }
};
</script>

<style></style>
