import * as React from 'react';
import { Box, Stack, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { DataGrid } from '@mui/x-data-grid';
import { VerifyButton } from './VerifyButton';
import { DetailButton } from './DetailButton';

export const RecordsTable = ({ records, refreshRecords, target }) => {

    const rows = records
        .filter(record => {
            if (!target) {
                return true;
            } else {
                return record.target === target;
            }
        })
        .map(record => {
            return {
                ...record,
                operations: record
            };
        });

    console.log(rows);

    const columns = [
        { field: 'id', headerName: '序号', flex: 1, headerAlign: 'center', align: 'center' },
        { 
            field: 'verified', headerName: '状态', flex: 1, headerAlign: 'center', align: 'center', renderCell: params => {
                if (params.value === 0) {
                    return (
                        <Tooltip title='未审核'>
                            <ChangeCircleIcon color='warning'/>
                        </Tooltip> 
                    )
                } else {
                    return (
                        <Tooltip title='已审核'>
                            <CheckCircleIcon color='success'/>
                        </Tooltip>
                    )
                }
            }
        },
        { field: 'datetime', headerName: '时间', flex: 3, headerAlign: 'center', align: 'center' },
        { field: 'type', headerName: '类型', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'entity', headerName: '内容', flex: 4, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '备注', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'comment', headerName: '评论', flex: 2, headerAlign: 'center', align: 'center' },
        {
            field: 'operations', headerName: '操作', flex: 2, headerAlign: 'center', align: 'center', renderCell: params => (
                <Stack direction='row' spacing={0.5}>
                    <DetailButton record={params.value} />
                    <VerifyButton recordId={params.value.id} refreshRecords={refreshRecords} />
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick={true}
            />
        </Box>
    );
}