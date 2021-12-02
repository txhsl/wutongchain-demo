<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 区块链状态
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                账本ID：{{ledger}}，
                连接状况：{{health ? '已连接' : '未连接'}}，
                账本高度：{{height}}。
            </div>
            <el-table :data="memberlist" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="shownName" width="85" label="节点名称"></el-table-column>
                <el-table-column prop="addr" label="IP"></el-table-column>
                <el-table-column width="50" label="状态">
                    <template #default="scope">{{scope.row.state ? '离线': '在线'}}</template>
                </el-table-column>
                <el-table-column prop="port" width="90" label="RPC端口"></el-table-column>
                <el-table-column prop="inAddr" label="内网地址"></el-table-column>
                <el-table-column prop="height" width="80" label="同步高度"></el-table-column>
                <el-table-column width="80" label="TLS状态">
                    <template #default="scope">{{scope.row.tlsEnabled ? '关闭': '开启'}}</template>
                </el-table-column>
                <el-table-column prop="hashType" width="80" label="哈希方式"></el-table-column>
                <el-table-column prop="consensus" width="80" label="共识算法"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { fetchChainStatus, fetchChainHeight, fetchChainMembers } from "../api/index";

export default {
    name: "basetable",
    setup() {
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
            ledger,
            health,
            height,
            memberlist,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}
</style>
