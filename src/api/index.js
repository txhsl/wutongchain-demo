import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const fetchChainStatus = query => {
    return request({
        url: '/api/chain/apihealth',
        method: 'get',
        params: query
    });
};

export const fetchChainHeight = query => {
    return request({
        url: '/api/block/height',
        method: 'get',
        params: query
    });
};

export const fetchChainMembers = query => {
    return request({
        url: '/api/memberlist',
        method: 'get',
        params: query
    });
};

export const installContract = query => {
    return request({
        url: '/api/tx/sc/install',
        method: 'post',
        params: { ledger: "jingangsai" },
        data: query
    });
}

export const queryContract = query => {
    return request({
        url: '/api/tx/sc/query',
        method: 'post',
        params: { ledger: "jingangsai" },
        data: query
    });
}

export const invokeContract = query => {
    return request({
        url: '/api/tx/sc/invoke',
        method: 'post',
        params: { ledger: "jingangsai" },
        data: query
    });
}