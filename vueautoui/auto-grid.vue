<div :style="gridStyle" :class="gridClass">
    <div style="height:100%">
        <el-table :data="gridData"
                  style="width: 100%;"
                  height="100%"
                  @selection-change="selectionChange" :size="gridSize">
            <el-table-column v-if="gridSelection" type="selection"
                             width="45">
            </el-table-column>

            <el-table-column v-for="col in gridColumns"
                             :label="col.label?col.label:col.name"
                             :width="getWidth(col)">
                <template slot-scope="item">
                    <div v-if="gridEdit && !col.readonly && item.row._editor==true">
                        <el-input-number v-if="col.type=='number'" v-model="item.row[col.name]" :min="-9999999" :max="9999999" style="width: 100%;" :size="gridSize">
                        </el-input-number>

                        <el-link v-else-if="col.type=='link'" type="primary" @click="onCommand(item.row,col.name)">{{item.row[col.name]?item.row[col.name]:col.value}}</el-link>

                        <el-date-picker v-else-if="col.type=='date'" v-model="item.row[col.name]"
                                        align="left"
                                        type="date" style="width: 100%;" :size="gridSize">
                        </el-date-picker>

                        <el-time-picker v-else-if="col.type=='time'" v-model="item.row[col.name]" style="width: 100%;" :size="gridSize">
                        </el-time-picker>

                        <el-select v-else-if="col.type=='select'" v-model="item.row[col.name]" style="width: 100%;" :size="gridSize">
                            <el-option v-if="col.data && col.nulloption==true">无选择</el-option>
                            <el-option v-if="col.data" v-for="sitem in col.data" :label="sitem.label?sitem.label:sitem.value" :value="sitem.value"></el-option>
                        </el-select>

                        <el-radio-group v-else-if="col.type=='radio'" v-model="item.row[col.name]" :size="gridSize">
                            <el-radio v-if="col.data" v-for="sitem in col.data" :label="sitem.value">{{sitem.label?sitem.label:sitem.value}}</el-radio>
                        </el-radio-group>

                        <el-checkbox-group v-else-if="col.type=='checkbox'" v-model="item.row[col.name]" :size="gridSize">
                            <el-checkbox v-if="col.data" v-for="sitem in col.data" :label="sitem.value">{{sitem.label?sitem.label:sitem.value}}</el-checkbox>
                        </el-checkbox-group>

                        <el-switch v-else-if="col.type=='switch'" v-model="item.row[col.name]" :size="gridSize"></el-switch>

                        <el-input v-else-if="col.type=='remark'" v-model="item.row[col.name]" type="textarea" :row="col.row?col.row:3" :size="gridSize"></el-input>

                        <el-rate v-else-if="col.type=='rate'" v-model="item.row[col.name]"></el-rate>
                        <div v-else-if="col.type=='img'" style="display:contents">
                            <img :style="{height:col.height?col.height:'100%'}" :src="item.row[col.name]?item.row[col.name]:col.value" />
                            <auto-uploadimg :title="col.label" :size="gridSize" :url="col.uploadurl" :fileSize="col.filesize" v-model="item.row[col.name]"></auto-uploadimg>
                        </div>
                        <auto-password v-else-if="col.type=='setpassword'" v-model="item.row[col.name]" :type="col.pwdtype" :size="gridSize" @completed="onCommand(item.row,col.name)">

                        </auto-password>
                        <el-button :size="gridSize" v-else-if="col.type=='viewpassword'" icon="el-icon-view" :title="item.row[col.name]?item.row[col.name]:'无'" circle></el-button>

                        <el-input v-else v-model="item.row[col.name]" :size="gridSize"></el-input>
                    </div>
                    <div v-else>
                        <el-link v-if="col.type=='link'" type="primary" @click="onCommand(item.row,col.name)">{{item.row[col.name]?item.row[col.name]:col.value}}</el-link>
                        <el-button :size="gridSize" v-else-if="col.type=='viewpassword'" icon="el-icon-view" :title="item.row[col.name]?item.row[col.name]:'无'" circle></el-button>
                        <img v-else-if="col.type=='img'" :style="{height:col.height?col.height:'100%'}" :src="item.row[col.name]?item.row[col.name]:col.value" />
                        <el-rate v-else-if="col.type=='rate'" v-model="item.row[col.name]" disabled show-score></el-rate>
                        <el-switch v-else-if="col.type=='switch'" v-model="item.row[col.name]"
                                   disabled>
                        </el-switch>
                        <auto-password v-else-if="col.type=='setpassword'" v-model="item.row[col.name]" :type="col.pwdtype" :size="gridSize" @completed="onCommand(item.row,col.name)">

                        </auto-password>
                        <div v-else-if="col.type=='html'" v-html="item.row[col.name]">

                        </div>
                        <span v-else> {{getViewValue(item.row[col.name],col.data)}}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="right">
                <template slot-scope="item">
                    <el-button v-if="item.row._editor==true && gridEdit==true" icon="el-icon-refresh-right" type="info" :size="gridSize" circle @click="item.row._editor=false;onRefresh()"></el-button>
                    <el-button v-if="item.row._editor==false && gridEdit==true" type="info" :size="gridSize" icon="el-icon-edit" circle @click="onEdit(item.row)"></el-button>
                    <el-button v-if="item.row._editor==true && gridEdit==true" type="info" :size="gridSize" icon="el-icon-check" circle @click="onItemChange(item.row)"></el-button>

                    <el-button v-if="gridDelete" :size="gridSize" type="danger" icon="el-icon-delete" circle @click="onItemDelete(item.row)"></el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
    <div style="text-align:right;">
        <el-pagination v-if="gridPages>1" layout="prev, pager, next" @current-change="onCurrentChange"
                       :page-size="1"
                       :total="gridPages" :current-page="gridCurrentpage">
        </el-pagination>
    </div>
</div>
<script>
    {
        props: ["columns", "height", "data", "selection", "delete", "edit", "size", "pages", "currentpage", "url", "style", "class"],
            data(){
            return {
                gridColumns: this.columns ? this.columns : [],
                gridData: [],
                gridHeight: this.height ? this.height : '',
                gridSelection: this.selection,
                gridDelete: this.delete,
                gridEdit: this.edit,
                gridSize: this.size,
                gridPages: this.pages ? this.pages : 0,
                gridCurrentpage: this.currentpage ? currentpage + 1 : 1,
                gridColumnsUrl: this.url,
                gridStyle: this.style,
                gridClass: this.class,
            };
        },
        methods: {
            setColumns(val){
                this.gridColumns = val ? val : [];
                this.loadColumnsUrlData();
            },
            getColumn(name){
                var result;
                this.gridColumns.forEach(v => {
                    if (name.toLowerCase() == v.name.toLowerCase()) {
                        result = v;
                    }
                });
                return result;
            },

            onCommand(item, name){
                this.$emit("command", { data: item, field: name });
            },
            getWidth(item){
                if (item.width)
                    return item.width;
                return '';
            },
            getViewValue(value, data){
                var result = value;
                if (data) {
                    data.forEach((v => {
                        if (v.value == value) {
                            result = v.label ? v.label : v.value;
                            return;
                        }
                    }));
                }

                return result;
            },
            selectionChange(val){
                this.$emit("selectchange", val);
            },
            onItemDelete(item){
                var e = {
                    data: item,
                    success: () => {
                        this.gridData.splice(item._id, 1);
                        this.onRefresh();
                    }
                }
                this.$emit("itemdelete", e);
            },
            onItemChange(item){
                var e = {
                    data: item,
                    success: () => {
                        item._editor = false;
                        this.onRefresh();
                    }
                }
                this.$emit("itemchange", e);
            },
            onEdit(item){
                var items = this.gridData;
                items.forEach((v) => {
                    if (v == item) {

                        v._editor = true;
                    }
                });
                this.onRefresh();
            },
            onRefresh(){
                this.gridData.push({});
                this.gridData.splice(this.gridData.length - 1, 1);
                for (i = 0; i < this.gridData.length; i++) {
                    this.gridData[i]._id = i;
                }
                this.gridHeight = this.height ? this.height : '';
            },
            onCurrentChange(index){
                this.$emit('pagechange', index - 1);
            },
            loadData(url){
                if (url && beetlex) {
                    var getDetail = new beetlexAction('/__apidoc/GetGridDetail');
                    getDetail.requested = (r) => {
                        this.gridColumns = r;
                        this.loadColumnsUrlData();
                        this.$emit('completed', r);
                    };
                    getDetail.get({ url: url });
                }
            },
            loadColumnsUrlData(){
                if (this.gridColumns) {
                    this.gridColumns.forEach((v) => {
                        if (v.dataurl) {

                            this.loadColumnData(v);
                        }
                    });
                }
            },
            loadColumnData(col){

                if (col.dataurl && beetlex) {
                    var action = new beetlexAction(col.dataurl);
                    action.requested = (r) => {
                        col.data = r;
                    };
                    action.get();
                }
            }
        },
        mounted(){
            this.gridData = [];
            if (this.data) {
                this.data.forEach(v => {
                    v._editor = false;
                    this.gridData.push(v);
                });
                this.onRefresh();
            }
            this.selectionChange([]);
            this.loadData(this.gridColumnsUrl);
            this.loadColumnsUrlData();
        },
        watch: {
            pages(val){
                this.gridPages = val ? val : 0;
            },
            currentpage(val){
                this.gridCurrentpage = val ? val + 1 : 1;
            },
            columnsurl(val){
                this.gridColumnsUrl = val;
                this.loadData(this.gridColumnsUrl);
            },
            columns(val){
                this.setColumns(val);
            },
            data(val){
                this.gridData = [];
                if (val) {
                    val.forEach(v => {
                        v._editor = false;
                        this.gridData.push(v);
                    });
                    this.onRefresh();
                }
                this.selectionChange([]);
            },
        }
    }
</script>