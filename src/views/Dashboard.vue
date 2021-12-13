<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ name }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>2021-12-01</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>上海</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:282px;">
                    <template #header>
                        <div class="clearfix">
                            <span>语言详情</span>
                        </div>
                    </template>
                    <div class="mt10">JavaScript<el-progress :percentage="77.2" color="#f1e05a"></el-progress></div>
                    <div class="mt10">Vue<el-progress :percentage="20.5" color="#42b983"></el-progress></div>
                    <div class="mt10">HTML<el-progress :percentage="1.7" color="#f56c6c"></el-progress></div>
                    <div class="mt10">CSS<el-progress :percentage="0.6"></el-progress></div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{health ? '已连接' : '未连接'}}</div>
                                    <div>连接状况</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{memberlist.length}}</div>
                                    <div>节点数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{height}}</div>
                                    <div>账本高度</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:433px;">
                    <template #header>
                        <div class="clearfix">
                            <span>节点列表（账本ID：{{ledger}}）</span>
                            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                        </div>
                    </template>

                    <el-table :data="memberlist" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                        <el-table-column prop="id" label="ID"></el-table-column>
                        <el-table-column prop="shownName" width="85" label="节点名称"></el-table-column>
                        <el-table-column width="50" label="状态">
                            <template #default="scope">{{scope.row.state ? '离线': '在线'}}</template>
                        </el-table-column>
                        <el-table-column prop="port" width="90" label="RPC端口"></el-table-column>
                        <el-table-column prop="inAddr" label="内网地址"></el-table-column>
                        <el-table-column prop="height" width="80" label="同步高度"></el-table-column>
                        <el-table-column width="80" label="TLS状态">
                            <template #default="scope">{{scope.row.tlsEnabled ? '关闭': '开启'}}</template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { fetchChainStatus, fetchChainHeight, fetchChainMembers } from "../api/index";

export default {
    name: "dashboard",
    setup() {
        const name = localStorage.getItem("ms_username");
        const role = name === "admin" ? "超级管理员" : "普通用户";

        const ledger = ref("jingangsai");
        const health = ref(false);
        const height = ref(0);
        const memberlist = ref([]);

        const query = reactive({
            ledger: ledger.value,
        });

        // 获取区块链状态数据
        const getStatus = () => {
            fetchChainStatus(query).then((res) => {
                if(res.state == 200) {
                    health.value = true;
                }
            });
            fetchChainHeight(query).then((res) => {
                if(res.state == 200) {
                    height.value = res.data;
                }
                else {
                    ElMessage.error("获取账本高度失败");
                }
            });
            fetchChainMembers(query).then((res) => {
                if(res.state == 200) {
                    memberlist.value = res.data.memberList;
                }
                else {
                    ElMessage.error("获取节点列表失败");
                }
            });
        };
        getStatus();

        return {
            name,
            role,
            ledger,
            health,
            height,
            memberlist,
        };
    },
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mt10 {
    margin-top: 10px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
