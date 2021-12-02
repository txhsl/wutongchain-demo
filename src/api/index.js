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