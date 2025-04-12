<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6" v-for="(item, index) in statisticsData" :key="index">
        <el-card class="data-card" :body-style="{ padding: '0px' }">
          <div class="card-content">
            <div class="card-icon" :style="{ backgroundColor: item.color }">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-value">{{ item.value }}</div>
              <div class="card-footer">
                <span :class="item.isIncrease ? 'up' : 'down'">
                  <el-icon>
                    <arrow-up v-if="item.isIncrease" />
                    <arrow-down v-else />
                  </el-icon>
                  {{ item.rate }}
                </span>
                <span class="period">较上周</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间图表区域 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <!-- 将 label 改为 value -->
              <el-radio-group v-model="salesTimeRange" size="small">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
                <el-radio-button value="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="salesChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>客户分布</span>
            </div>
          </template>
          <div class="chart-container" ref="customerChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部表格区域 -->
    <el-row :gutter="20" class="table-section">
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>最近订单</span>
              <el-button link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%" :border="false">
            <el-table-column prop="id" label="订单号" width="100" />
            <el-table-column prop="customer" label="客户名称" width="120" />
            <el-table-column prop="amount" label="金额">
              <template #default="scope">
                <span class="amount">¥{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="120" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>热门产品</span>
              <el-button link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="hotProducts" style="width: 100%" :border="false">
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="sales" label="销量" width="100" />
            <el-table-column prop="revenue" label="收入" width="120">
              <template #default="scope">
                <span class="amount">¥{{ scope.row.revenue }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="trend" label="趋势" width="100">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.trend"
                  :color="scope.row.trend > 50 ? '#67C23A' : '#E6A23C'"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted, markRaw } from 'vue'
import * as echarts from 'echarts'

// 修改导入，只保留实际使用的图标组件
import { 
  ArrowUp, 
  ArrowDown, 
  User, 
  ShoppingCart, 
  Goods, 
  Money 
} from '@element-plus/icons-vue'

// 顶部统计数据
const statisticsData = reactive([
  {
    title: '总用户数',
    value: '8,846',
    rate: '12%',
    isIncrease: true,
    icon: markRaw(User),  // 使用 markRaw 包装组件
    color: '#409EFF'
  },
  {
    title: '总订单数',
    value: '1,286',
    rate: '8%',
    isIncrease: true,
    icon: markRaw(ShoppingCart),  // 使用 markRaw 包装组件
    color: '#67C23A'
  },
  {
    title: '产品数量',
    value: '128',
    rate: '3%',
    isIncrease: false,
    icon: markRaw(Goods),  // 使用 markRaw 包装组件
    color: '#E6A23C'
  },
  {
    title: '总收入',
    value: '¥126,560',
    rate: '15%',
    isIncrease: true,
    icon: markRaw(Money),  // 使用 markRaw 包装组件
    color: '#F56C6C'
  }
])

// 销售趋势图表
const salesChartRef = ref(null)
const salesTimeRange = ref('month')
let salesChart: echarts.ECharts | null = null

// 客户分布图表
const customerChartRef = ref(null)
let customerChart: echarts.ECharts | null = null

// 最近订单数据
const recentOrders = reactive([
  { id: 'ORD-2023001', customer: '张三', amount: 1280, status: '已完成', date: '2023-06-15' },
  { id: 'ORD-2023002', customer: '李四', amount: 2560, status: '处理中', date: '2023-06-14' },
  { id: 'ORD-2023003', customer: '王五', amount: 890, status: '已完成', date: '2023-06-13' },
  { id: 'ORD-2023004', customer: '赵六', amount: 3200, status: '已取消', date: '2023-06-12' },
  { id: 'ORD-2023005', customer: '钱七', amount: 1560, status: '已完成', date: '2023-06-11' }
])

// 热门产品数据
const hotProducts = reactive([
  { name: '高级会员套餐', sales: 256, revenue: 25600, trend: 85 },
  { name: '标准会员套餐', sales: 186, revenue: 13950, trend: 65 },
  { name: '基础会员套餐', sales: 120, revenue: 6000, trend: 40 },
  { name: '企业定制服务', sales: 28, revenue: 56000, trend: 90 },
  { name: '数据分析报告', sales: 65, revenue: 9750, trend: 55 }
])

// 获取状态对应的标签类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '已完成': 'success',
    '处理中': 'warning',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

// 初始化销售趋势图表
const initSalesChart = () => {
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单数', '销售额']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单数',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#409EFF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ])
          }
        },
        {
          name: '销售额',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
            ])
          }
        }
      ]
    }
    
    salesChart.setOption(option)
  }
}

// 初始化客户分布图表
const initCustomerChart = () => {
  if (customerChartRef.value) {
    customerChart = echarts.init(customerChartRef.value)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['企业客户', '个人客户', '政府机构', '教育机构', '其他']
      },
      series: [
        {
          name: '客户分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '企业客户' },
            { value: 735, name: '个人客户' },
            { value: 580, name: '政府机构' },
            { value: 484, name: '教育机构' },
            { value: 300, name: '其他' }
          ]
        }
      ]
    }
    
    customerChart.setOption(option)
  }
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  salesChart?.resize()
  customerChart?.resize()
}

onMounted(() => {
  initSalesChart()
  initCustomerChart()
  window.addEventListener('resize', handleResize)
})

// 使用 onUnmounted 钩子而不是定义一个函数
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChart?.dispose()
  customerChart?.dispose()
})
</script>

<style scoped>
.dashboard-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.data-overview {
  margin-bottom: 20px;
}

.data-card {
  height: 120px;
  overflow: hidden;
  margin-bottom: 20px; /* 确保卡片之间有足够间距 */
}

/* 确保图表容器有足够高度 */
.chart-container {
  height: 350px;
  width: 100%;
}

/* 其他样式保持不变 */
</style>