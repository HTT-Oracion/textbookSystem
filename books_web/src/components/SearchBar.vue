<template>
  <el-row>
    <el-col :span="8">
      <el-input>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <el-col :span="4" v-if="showAdd">
      <el-button type="primary"> {{ btnTitle }}</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    showAdd: {
      type: Boolean,
      defalut: true
    },
    btnTitle: {
      type: String,
      defalut: '添加成员'
    }
  }
}
</script>

<style>
</style>