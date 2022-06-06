import * as React from 'react';
import { Box, Avatar, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { DeleteAuthorsButton } from './DeleteAuthorsButton';
// import { UpdateAuthorsButton } from './UpdateAuthorsButton';
import config from '../../config';

export const ClipsTable = ({clips, refresh}) => {
    
    const rows = clips
        .map(clip => {
            return {
                id: clip.id,
                datetime: clip.datetime,
                authorId: clip.authorId,
                title: clip.title,
                bv: clip.bv,
                avatar: clip.id,
                operations: clip
            };
        });

    const columns = [
        { field: 'id', headerName: 'ID', flex:1, headerAlign:'center', align:'center' },
        { field: 'datetime', headerName: '发布时间', flex:4, headerAlign:'center', align:'center' },
        { field: 'authorId', headerName: '主播id', flex:1, headerAlign:'center', align:'center' },
        { field: 'title', headerName: '标题', flex:2, headerAlign:'center', align:'center' },
        { field: 'avatar', headerName: '封面', flex:1, headerAlign:'center', align:'center', renderCell: params=> (
            params.value && <Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/img/clips/${params.value.id}.webp`} />
        )},
        { field: 'bv', headerName: 'BV', flex:2, headerAlign:'center', align:'center' },
        { field:'operations', headerName:'操作', flex:1, headerAlign:'center', align:'center',renderCell:params => (
            params.value &&
            <Stack direction='row' spacing={0.5}>
                {/* <UpdateAuthorsButton author={params.value} refresh={refresh} />
                <DeleteAuthorsButton author={params.value} refresh={refresh} /> */}
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