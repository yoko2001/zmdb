import * as React from 'react';
import { Box, Avatar, Stack, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { DataGrid } from '@mui/x-data-grid';
import { VerifyRecordsButton } from '../VerifyRecordsButton';
import { CloseRecordsButton } from '../CloseRecordsButton';
import { DeleteRecordsButton } from '../DeleteRecordsButton';
import config from '../../config';

export const AuthorsRecordsTable = ({ records, refresh }) => {
    
    const rows = records
        .map(record => {
            const author = JSON.parse(record.entity);
            return {
                id: record.id,
                verified: record.verified,
                datetime: record.datetime,
                type: record.type,
                authorId: author.id,
                avatar: author.id,
                name: author.name,
                organizationId: author.organizationId,
                uid: author.uid,
                remark: record.remark,
                comment: record.comment,
                operations: record
            };
        });

    const columns = [
        { field: 'verified', headerName: '状态', flex:1, headerAlign:'center', align:'center', renderCell: params => {
            if (params.value === 0) {
                return (
                    <Tooltip title='未审核'>
                        <ChangeCircleIcon color='warning'/>
                    </Tooltip> 
                )
            } else if (params.value === 1) {
                return (
                    <Tooltip title='已审核'>
                        <CheckCircleIcon color='success'/>
                    </Tooltip>
                )
            } else if (params.value === 2) {
                return (
                    <Tooltip title='已关闭'>
                        <DoNotDisturbOnIcon color='inherit'/>
                    </Tooltip>
                )
            }
        }},
        { field: 'datetime', headerName: '时间', flex:4, headerAlign:'center', align:'center' },
        { field: 'type', headerName: '类型', flex:2, headerAlign:'center', align:'center' },
        { field: 'authorId', headerName: 'ID', flex:1, headerAlign:'center', align:'center' },
        { field: 'avatar', headerName: '头像', flex:1, headerAlign:'center', align:'center', renderCell: params=> (
            params.value && <Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/img/organizations/${params.value.id}.webp`} />
        )},
        { field: 'name', headerName: '名称', flex:3, headerAlign:'center', align:'center' },
        { field: 'organizationId', headerName: '社团/组 id', flex:1, headerAlign:'center', align:'center' },
        { field: 'uid', headerName: 'uid', flex:2, headerAlign:'center', align:'center' },
        { field: 'remark', headerName: '备注', flex:2, headerAlign:'center', align:'center' },
        { field: 'comment', headerName: '回复', flex:2, headerAlign:'center', align:'center' },
        { field:'operations', headerName:'操作', flex:2.5, headerAlign:'center', align:'center',renderCell:params => (
            params.value &&
            <Stack direction='row' spacing={0.5}>
                <VerifyRecordsButton 
                    record={params.value}
                    refresh={refresh}
                />
                <CloseRecordsButton 
                    record={params.value}
                    refresh={refresh}
                />
                <DeleteRecordsButton 
                    record={params.value}
                    refresh={refresh}
                />
            </Stack>
        )}
    ];

    return (
        <Box sx={{ width:'100%' }}>
            <DataGrid 
                autoHeight 
                rows={rows} 
                columns={columns} 
                pageSize={10} 
                rowsPerPageOptions={[10]} 
                disableSelectionOnClick={true} 
            />
        </Box>
    )
}