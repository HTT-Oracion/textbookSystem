export const navList = [
  {
    id: 1, index: '/book', icon: "el-icon-notebook-1", title: "教材管理",
    children: [
      {
        id: 11, index: '/book', icon: "el-icon-notebook-2", title: "教材列表"
      },
      {
        id: 12, index: '/category', icon: "el-icon-menu", title: "教材类别"
      }
    ]
  },
  {
    id: 2, index: '/department', icon: "el-icon-s-home", title: "院系管理",
    children: [
      {
        id: 21, index: '/department', icon: "el-icon-office-building", title: "院系列表"
      },
      {
        id: 22, index: '/major', icon: "el-icon-s-operation", title: "专业列表"
      },
      {
        id: 23, index: '/class', icon: "el-icon-box", title: "班级列表"
      }
    ]
  },
  {
    id: 3, index: '/lesson', icon: "el-icon-collection", title: "教学管理",
    children: [
      {
        id: 31, index: '/lesson', icon: "el-icon-menu", title: "课程列表"
      }
    ]
  },
  {
    id: 4, index: '/user', icon: "el-icon-s-custom", title: "人员管理",
    children: [
      {
        id: 41, index: '/user/charge', icon: "el-icon-s-goods", title: "订购人员"
      },
      {
        id: 42, index: '/user/approval', icon: "el-icon-bell", title: "订购人员"
      }
    ]
  },
  {
    id: 5, index: '/order', icon: "el-icon-s-order", title: "订单管理",
    children: [
      {
        id: 51, index: '/order', icon: "el-icon-s-order", title: "订单列表"
      }
    ]
  }

]