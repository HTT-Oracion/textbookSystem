<template>
  <div class="class-page">
    <el-card>
      <my-bread nameOne="院系管理" nameTwo="班级列表"></my-bread>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getClassList" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getClassList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- <el-col :span="4">
          <el-button type="primary" @click="addClassVisible = true">
            添加班级</el-button
          >
        </el-col> -->
      </el-row>
      <el-table :data="classList" border stripe>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="major_name" label="班级名称"></el-table-column>
        <el-table-column prop="cls_name" label="班级名称"></el-table-column>
        <el-table-column prop="total" label="班级人数"></el-table-column>
        <el-table-column prop="monitor" label="班长"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scoped">
            <el-button type="primary" @click="toEdit(scoped.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteClass(scoped.row.id)"
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
      >
      </el-pagination>
    </el-card>
    <!-- add -->
    <!-- <el-dialog
      title="添加班级"
      :visible.sync="addClassVisible"
      width="50%"
      @before-close="handleClose"
    >
      <el-form ref="addClassRef" :model="postForm" label-width="100px">
        <el-form-item prop="id" label="班级编号：">
          <el-input v-model="postForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="grade" label="年级：">
          <el-input v-model.number="postForm.grade"></el-input>
        </el-form-item>
        <el-form-item prop="major_name" label="专业名称：">
          <el-input v-model="postForm.major_name"></el-input>
        </el-form-item>
        <el-form-item prop="cls_name" label="班级名称">
          <el-input v-model="postForm.cls_name"></el-input>
        </el-form-item>
        <el-form-item prop="cls_name" label="学生人数">
          <el-input v-model="postForm.cls_name"></el-input>
        </el-form-item>
        <el-form-item prop="monitor" label="班长">
          <el-input v-model="postForm.monitor"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系方式">
          <el-input v-model="postForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="majorId" label="专业名称">
          <el-select v-model="postForm.departmentId" placeholder="请选择">
            <el-option
              v-for="(item, index) in majorList"
              :key="index"
              :label="item.dep_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('addClassRef')">取 消</el-button>
        <el-button type="primary" @click="confirmAddClass">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- edit -->
    <el-dialog title="编辑班级" :visible.sync="editClassVisible" width="50%">
      <el-form ref="editClassRef" :model="postForm" label-width="100px">
        <el-form-item prop="id" label="班级编号：">
          <el-input v-model="postForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="grade" label="年级：">
          <el-input v-model.number="postForm.grade"></el-input>
        </el-form-item>
        <el-form-item prop="major_name" label="专业名称：">
          <el-input v-model="postForm.major_name"></el-input>
        </el-form-item>
        <el-form-item prop="cls_name" label="班级名称">
          <el-input v-model="postForm.cls_name"></el-input>
        </el-form-item>
        <el-form-item prop="total" label="学生人数">
          <el-input v-model="postForm.total"></el-input>
        </el-form-item>
        <el-form-item prop="monitor" label="班长">
          <el-input v-model="postForm.monitor"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系方式">
          <el-input v-model="postForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="majorId" label="专业编号">
          <el-input v-model="postForm.majorId" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('editClassRef')">取 消</el-button>
        <el-button type="primary" @click="confirmEditClass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClassesApi,
  getClassById,
  addClassApi,
  editClassApi,
  deleteClassApi
} from "@/api/information";
import { pageMixin } from "@/mixin";
export default {
  name: "Class",
  mixins: [pageMixin],
  data() {
    return {
      addClassVisible: false,
      editClassVisible: false,
      classList: [],
      postForm: {}
    };
  },
  watch: {
    "queryInfo.pageNum": function(val, oldVal) {
      this.getClassList();
    },
    "queryInfo.pageSize": function(val, oldVal) {
      this.getClassList();
    }
  },
  created() {
    this.getClassList();
  },
  methods: {
    async getClassList() {
      const { data } = await getClassesApi(this.queryInfo);
      this.classList = data.result;
    },
    reset(ref) {
      // this.addClassVisible = false
      this.editClassVisible = false;
      this.$refs[ref].resetFields();
    },
    async toEdit(id) {
      this.editClassVisible = true;
      const { data } = await getClassById(id);
      console.log(data);
      this.postForm = data.result;
    },
    deleteClass(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { data } = await deleteClassApi(id);
        if (data.status === 200) {
          this.$message.success("删除成功!");
          this.getClassList();
        } else {
          this.$message.error("删除失败!");
        }
      });
    },
    async confirmAddClass() {
      const { data } = await addClassApi(this.postForm);
      if (data.status === 200) {
        this.$message.success("添加成功!");
        this.getClassList();
        this.reset("addClassRef");
      } else {
        this.$message.error("添加失败!");
        this.reset("addClassRef");
      }
    },
    async confirmEditClass() {
      const { data } = await editClassApi(this.postForm.id, this.postForm);
      if (data.status === 200) {
        this.$message.success("修改成功!");
        this.reset("editClassRef");
        this.getClassList();
      } else {
        this.$message.error("修改失败!");
        this.reset("editClassRef");
      }
    },
    handleClose() {
      this.reset("editClassRef");
    }
  }
};
</script>

<style></style>
