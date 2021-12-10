<template>
    <div>
        <div class="container">
        <el-menu
        :default-active="activeNavMenu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="onSelectNavMenu"
        >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">指标认定</el-menu-item>
        <el-menu-item index="3">碳足迹结算</el-menu-item>
        <el-menu-item index="4">碳积分交易</el-menu-item>
        <el-menu-item index="5">我的</el-menu-item>
        </el-menu>
        <div v-if="isNavSelected('1')">

        </div>
        <div v-if="isNavSelected('2')">
        <div class="form-box mt20">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="船舶类型" prop="type">
                <el-select v-model="activeShipType" @change="onShipTypeChange" id="ship-type">
                <el-option
                    v-for="item in shipType"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="船舶吨位" prop="tonnage">
                <el-select v-model="activeTonnage" id="ship-tonnage">
                <el-option
                    v-for="item in tonnage"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主发动机功率" prop="mainPower">
                <el-input v-model="form.mainPower"></el-input>
            </el-form-item>
            <el-form-item label="副发动机功率" prop="mainPower">
                <el-input v-model="form.subPower"></el-input>
            </el-form-item>
            <el-button type="primary" @click="calEEXI">计算EEXI</el-button>
            </el-form>
        </div>
        </div>
        <div v-if="isNavSelected('3')">

        </div>
        <div v-if="isNavSelected('4')">

        </div>
        <div v-if="isNavSelected('5')">
        <el-row>
            <el-col :span="2">
            <el-menu
                :default-active="activeMeMenu"
                mode="vertical"
                active-text-color="#ffd04b"
                background-color="#545c64"
                text-color="#fff"
                @select="onSelectMeMenu"
                class="me-menu"
            >
                <el-menu-item index="1">通用</el-menu-item>
                <el-menu-item index="2">我的积分</el-menu-item>
                <el-menu-item index="3">交易记录</el-menu-item>
            </el-menu>
            </el-col>
            <el-col :span="22">
            <div v-if="isMeMenuSelected('1')">

            </div>
            <div v-if="isMeMenuSelected('2')">

            </div>
            <div v-if="isMeMenuSelected('3')">

            </div>
            </el-col>
        </el-row>

        </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";

export default {
    name: "Platform",
    setup() {
        const activeNavMenu = ref("1");
        const activeMeMenu = ref("1");

        const activeShipType = ref(0);
        const activeTonnage = ref(0);
        const shipType = ref([
        {
            label: "集装箱船",
            value: 0,
        },
        {
            label: "油轮",
            value: 1,
        },
        {
            label: "普通货船",
            value: 2,
        },
        ]);

        const allTonnage = [
        [
            {
            label: "10000及以上但小于15000载重吨",
            value: 0,
            },
            {
            label: "15000及以上但小于40000载重吨",
            value: 1,
            },
            {
            label: "40000及以上但小于80000载重吨",
            value: 2,
            },
            {
            label: "80000及以上但小于120000载重吨",
            value: 3,
            },
            {
            label: "120000及以上但小于200000载重吨",
            value: 4,
            },
            {
            label: "200000及以上载重吨",
            value: 5,
            },
        ],
        [
            {
            label: "4000及以上但小于20000载重吨",
            value: 0,
            },
            {
            label: "20000及以上但小于200000载重吨",
            value: 1,
            },
            {
            label: "200000及以上载重吨",
            value: 2,
            },
        ],
        [
            {
            label: "3000及以上但小于15000载重吨",
            value: 0,
            },
            {
            label: "15000及以上载重吨",
            value: 1,
            },
        ],
        ];
        const tonnage = ref(allTonnage[activeTonnage.value]);
        const form = reactive({
        type: "",
        tonnage: "",
        mainPower: "",
        subPower: "",
        });
        const rules = {};

        const onShipTypeChange = (val) => {
        tonnage.value = allTonnage[val];
        activeTonnage.value = 0;
        };
        const isNavSelected = (index) => activeNavMenu.value === index;
        const isMeMenuSelected = (index) => activeMeMenu.value === index;
        const onSelectNavMenu = (key) => {
        activeNavMenu.value = key;
        };
        const onSelectMeMenu = (key) => {
        activeMeMenu.value = key;
        };
        const calEEXI = () => {};
        return {
        activeNavMenu,
        isNavSelected,
        activeMeMenu,
        onSelectNavMenu,
        isMeMenuSelected,
        onSelectMeMenu,
        shipType,
        activeShipType,
        activeTonnage,
        tonnage,
        onShipTypeChange,
        form,
        rules,
        calEEXI,
        };
    },
};
</script>

<style scoped>
.me-menu {
    text-align: center;
}
.mt20 {
    margin-top: 20px;
}
:deep(#ship-type) {
    width: 120px;
}
:deep(#ship-tonnage) {
    width: 260px;
}
</style>
