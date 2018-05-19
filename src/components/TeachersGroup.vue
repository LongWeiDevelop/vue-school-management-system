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
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="Teachers Group"
            >
            <template slot-scope="scope">
              <span style="margin-center: 10px">{{ scope.row.group }}</span>
            </template>
          </el-table-column>
          <el-table-column
            >
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-checkbox v-model="checkbox" size="mini" border>A1</el-checkbox>
                  <el-checkbox v-model="checkbox" size="mini" border>A1</el-checkbox>
                  <el-checkbox v-model="checkbox" size="mini" border>A1</el-checkbox>
                  <el-checkbox v-model="checkbox" size="mini" border>A1</el-checkbox>
                  <el-checkbox v-model="checkbox" size="mini" border>A1</el-checkbox>
                  <el-checkbox v-model="checkbox" size="mini" border>A1</el-checkbox>
                </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">Edit
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'teachers-group',
    data() {
      return {
        checkbox: true,
        tableData: [{
          id: '1',
          group: 'School 001(Professors)',
        }, {
          id: '2',
          group: 'School 002(Professors)',
        }, {
          id: '3',
          group: 'School 003(Professors)',
        }, {
          id: '4',
          group: 'School 004(Professors)',
        }]
      }
    },
    mounted() {
      console.log('----- Teachers Group mounted -----')
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  }
</script>

<style scoped>


</style>
