<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="1">
          <div>
            <el-button icon="el-icon-back">Back</el-button>
          </div>
        </el-col>
        <el-col :span="23"></el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <el-row class="table-header" :gutter="24">
          <el-col :span="2">
            <div>
              <el-select v-model="action" placeholder="Action">
                <el-option
                  v-for="item in actions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="2">
            <div>
              <el-select v-model="value">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

          </el-col>
          <el-col :span="6">
            <div>
              <el-input placeholder="" v-model="input"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div>
            <table>
              <thead>
              <tr>
                <th style="width:3%;">
                  <el-checkbox></el-checkbox>
                </th>
                <th style="width:6%; min-height:132.36px;"><span>Program</span></th>
                <th style="width: 34%;"><img src="../../images/gearup-small.png"/></th>
                <th style="width: 57%;"><img src="../../images/speedup-small.png"/></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in rows">
                <td style="width:3%;">
                  <el-checkbox></el-checkbox>
                </td>
                <td style="width:6%; cursor: pointer" @click="selectSchool(row.id)"><p>{{row.program}}</p></td>
                <td style="width: 34%;">
                  <el-checkbox label="1" v-model="row.group1.status1" size="mini" border></el-checkbox>
                  <el-checkbox label="2" v-model="row.group1.status2" size="mini" border></el-checkbox>
                  <el-checkbox label="3" v-model="row.group1.status3" border size="mini"></el-checkbox>
                  <el-checkbox label="4" v-model="row.group1.status4" border size="mini"></el-checkbox>
                  <el-checkbox label="5" v-model="row.group1.status5" border size="mini"></el-checkbox>
                  <el-checkbox label="6" v-model="row.group1.status6" border size="mini"></el-checkbox>
                </td>
                <td style="width: 5%;">
                  <el-checkbox v-model="row.group2.status1" size="mini" border>A1</el-checkbox>
                  <el-checkbox v-model="row.group2.status2" size="mini" border>A2</el-checkbox>
                  <el-checkbox v-model="row.group2.status3" size="mini" border>A2+</el-checkbox>
                  <el-checkbox v-model="row.group2.status4" size="mini" border>B1</el-checkbox>
                  <el-checkbox v-model="row.group2.status5" size="mini" border>B1+</el-checkbox>
                  <el-checkbox v-model="row.group2.status6" size="mini" border>B2</el-checkbox>
                  <el-checkbox v-model="row.group2.status7" size="mini" border>B2+</el-checkbox>
                  <el-checkbox v-model="row.group2.status8" size="mini" border>C1</el-checkbox>
                  <el-checkbox v-model="row.group2.status9" size="mini" border>C1+</el-checkbox>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-row>
        <el-row class="navigation" :gutter="24">
          <el-col class="table-footer-left">
            <div>
              <span class="demonstration">Showing 1 to 1 of 1 entries</span>
            </div>
          </el-col>
          <el-col class="table-footer-right">
            <div>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="100">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-main>
  </el-container>
</template>


<script>
  export default {
    name: 'Schools',
    data() {
      return {
        checked: true,
        rows: [
          {
            id: '1',
            program: 'School 1',
            checked: true,  //it must be here
            group1: {
              status1: true,
              status2: true,
              status3: true,
              status4: true,
              status5: true,
              status6: true,
            },
            group2: {
              status1: true,
              status2: true,
              status3: true,
              status4: true,
              status5: true,
              status6: true,
              status7: true,
              status8: true,
              status9: true,
            },
          },
          {
            id: '2',
            program: 'School 2',
            group1: {
              status1: true,
              status2: true,
              status3: true,
              status4: true,
              status5: true,
              status6: true,
            },
            group2: {
              status1: true,
              status2: true,
              status3: true,
              status4: true,
              status5: true,
              status6: true,
              status7: true,
              status8: true,
              status9: true,
            },
          },
          {
            id: '3',
            program: 'School 3',
            group1: {
              status1: true,
              status2: true,
              status3: true,
              status4: true,
              status5: true,
              status6: true,
            },
            group2: {
              status1: true,
              status2: true,
              status3: true,
              status4: true,
              status5: true,
              status6: true,
              status7: true,
              status8: true,
              status9: true,
            },
          },
        ],
        options: [{
          value: 10,
          label: '10'
        }, {
          value: 25,
          label: '25'
        }, {
          value: 50,
          label: '50'
        }, {
          value: 100,
          label: '100'
        }],
        actions: [{
          value: 'Delete',
          label: 'Delete'
        }, {
          value: 'Create',
          label: 'Create'
        }],
        action: '',
        value: 10,
        input: '',
      }
    },
    mounted() {
      console.log('----- Schools list mounted -----')
    },
    methods: {
      selectSchool(item) {
        console.log(item)
        this.$router.push({path: `${item}/teachers`})
      },
      add() {
        this.$router.push({path:'add'})
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  table {
    width: 100%;
    margin-top: 2%;
    border: 1px solid #dcdfe6;
    border-collapse: collapse;
    border-radius: 1%;
    padding: 1%;
  }

  table, th, td {
    border: 1px solid #dcdfe6;
    padding: 1%;
  }

  table thead tr th:nth-child(2) {
    text-align: center;
  }

  table thead tr th:nth-child(2) span {
    margin: 0 auto !important;
  }

  table thead tr th:nth-child(3) {
    text-align: left;
    padding-left: 2%;
  }

  table thead tr th:nth-child(4) {
    text-align: left;
    padding-left: 2%;
  }

  .navigation {
    margin-top: 1%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .navigation .table-footer-left {
    text-align: left;
  }

  .navigation .table-footer-right {
    text-align: right;
  }

  .table-header {
    position: relative;
  }

  .table-header div:nth-child(3) {
    position: absolute;
    right: 0;
  }
</style>
