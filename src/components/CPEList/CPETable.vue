<template>
  <div  class="page-table">
    
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      class="cpetable"
      style="width: 100%; margin-top: 20px"
      :cell-style="{borderColor:'#C0C0C0'}"
      :header-cell-style="{borderColor:'#C0C0C0'}"
      @cell-click="handleCellClick">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
        <template slot-scope="scope">
          <div @click="handleFirstColumnClick(scope.row, scope.$index)">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        label="位置">
      </el-table-column>
      <el-table-column
        prop="deployState"
        label="部署状态">
      </el-table-column>
      <el-table-column
        prop="info"
        label="端口信息">
        <el-table-column
          prop="port"
          label="端口">
        </el-table-column>
        <el-table-column
          prop="netType"
          label="网络类型">
        </el-table-column>
        <el-table-column
          prop="upBandwidth"
          label="上行带宽">
        </el-table-column>
        <el-table-column
          prop="downBandWidth"
          label="下行带宽">
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级">
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="goToDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
      
    </el-table>
    



  </div>
    
  
    
</template>



<script>



export default{
  data(){
    return {
      tableData: [{
          id: '1',
          name: '北京接入点',
          location:"北京",
          deployState:"已部署",
          port:"Eth1",
          netType:"低轨",
          upBandwidth:"100MB/s",
          downBandWidth:"100MB/s",
          priority:"1"
        }, {
          id: '1',
          name: '北京接入点',
          location:"北京",
          deployState:"已部署",
          port:"Eth2",
          netType:"高轨",
          upBandwidth:"100MB/s",
          downBandWidth:"100MB/s",
          priority:"2"
        }, {
          id: '1',
          name: '北京接入点',
          location:"北京",
          deployState:"已部署",
          port:"Eth3",
          netType:"移动通信",
          upBandwidth:"100MB/s",
          downBandWidth:"100MB/s",
          priority:"3"
        }, {
          id: '2',
          name: '海南接入点',
          location:"海南",
          deployState:"已部署",
          port:"Eth1",
          netType:"低轨",
          upBandwidth:"100MB/s",
          downBandWidth:"100MB/s",
          priority:"1"
        }, {
          id: '2',
          name: '海南接入点',
          location:"海南",
          deployState:"已部署",
          port:"Eth2",
          netType:"高轨",
          upBandwidth:"100MB/s",
          downBandWidth:"100MB/s",
          priority:"2"
        }, {
          id: '2',
          name: '海南接入点',
          location:"海南",
          deployState:"已部署",
          port:"Eth3",
          netType:"移动通信",
          upBandwidth:"100MB/s",
          downBandWidth:"100MB/s",
          priority:"3"
        }],
      timer:null,//计时器
      url : "http://59.110.238.62",//服务器地址
    }
  },

  methods:{
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex>=0&&columnIndex<=3||columnIndex===9) {
          if (rowIndex % 3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },

      handleFirstColumnClick(row, index) {
        // 在这里编写第一列单元格点击事件的处理逻辑
        console.log("点击了第一列单元格：" + row.name);
        console.log("行索引：" + index);
        window.open('http://59.110.238.62:1010', '_blank');
      },
      handleCellClick(row, column, cell, event) {
        // 防止第一列单元格点击事件冒泡到整行的点击事件
        if (column.property === 'name') {
          event.stopPropagation();
        }
      },

      goToDetail(row){
        this.$store.dispatch('updateSelectedTerminal', row);
        // console.log(row);//通过这个可以判断当点击按钮的时候，获取的row是三行中第一行的数据
        this.$router.push({ path: '/detail' });
      }
  },

 
}
</script>

<style lang="less" scoped>
.page-table {
  width: inherit;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);//模糊程度
  // &.no-data {
  //   height: 450px;
  // }
}

.cpetable{
  border-radius: 10px 10px 0 0 ;
  
  
}


// //修改单元格内分割线的颜色
// /deep/.el-table--border .el-table__cell, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
//     border-right: 1px solid red;
//     border-bottom: 1px solid red;
// }

::v-deep(.el-table),
::v-deep(.el-table__expanded-cell){
  background-color: transparent !important;
}

// .el-table{
//   --el-table-border:none;//除去表头底下的白线
// }

//设置表格背景透明
::v-deep(.el-table tr),
::v-deep(.el-table td) {
  color: rgba(255, 255, 255, 0.7);//表项文本颜色
  font-size: 15px;
  background-color: transparent !important;
}



//设置表头左上角圆角
/deep/ .cpetable .el-table__header-wrapper table thead tr:first-child th:first-child {
  border-top-left-radius: 10px;
}

//设置表头右上角圆角
/deep/ .cpetable .el-table__header-wrapper table thead tr:first-child th:last-child {
  border-top-right-radius: 10px;
}

//表头背景设置
/deep/ .cpetable .el-table__header-wrapper table thead.is-group th.el-table__cell {
  background: rgba(29, 29, 207, 0.686) !important;
  font-size: 16px;
  color:white;//表头文本颜色
  // border-color: red;//修改表头边框颜色
}


//控制单元格之间的分割线（注释则显示分割线）
// ::v-deep(.el-table td.el-table__cell) {
//   border-bottom: none;
// }

// ::v-deep(.el-table__inner-wrapper::before) {
//   display: none;
// }


// // 修改分页样式
// .pagination {
//   display: flex;
//   justify-content: flex-end;
//   width: 100%;
// }
// ::v-deep(.el-pager li.number),
// ::v-deep(.el-pager li.more),
// ::v-deep(.btn-prev.is-first),
// ::v-deep(.btn-next.is-last) {
//   background: rgba(255, 255, 255, 0.3);
//   box-shadow: 0 12px 20px 6px rgb(104 112 118 / 0.2);
//   border-radius: 50%;
//   color: #2d3d50;
// }
// ::v-deep(.el-pager li.number.is-active) {
//   box-shadow: 0 4px 14px #5ea2ef;
//   background: #0072f5;
//   color: #fff;
// }



</style>