import * as React from 'react';
import { Box, Avatar, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteAuthorsButton } from './DeleteAuthorsButton';
import { UpdateAuthorsButton } from './UpdateAuthorsButton';
import config from '../../config';

export const AuthorsTable = ({authors, refresh}) => {
    
    const rows = authors
        .map(author => {
            return {
                id: author.id,
                uid: author.uid,
                organization: author.organization,
                name: author.name,
                avatar: author.id,
                operations: author
            };
        });

    const columns = [
        { field: 'id', headerName: 'ID', flex:1, headerAlign:'center', align:'center' },
        { field: 'avatar', headerName: '头像', flex:1, headerAlign:'center', align:'center', renderCell: params=> (
            params.value && <Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/img/authors/${params.value.id}.webp`} />
        )},
        { field: 'name', headerName: '名称', flex:2, headerAlign:'center', align:'center' },
        { field: 'uid', headerName: 'uid', flex:1, headerAlign:'center', align:'center' },
        { field: 'organization', headerName: '社团/组', flex:1, headerAlign:'center', align:'center', renderCell: params => (
            params.value && <Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/img/organizations/${params.value.id}.webp`} alt={params.value.name} />
        )},
        { field:'operations', headerName:'操作', flex:1, headerAlign:'center', align:'center',renderCell:params => (
            params.value &&
            <Stack direction='row' spacing={0.5}>
                <UpdateAuthorsButton author={params.value} refresh={refresh} />
                <DeleteAuthorsButton author={params.value} refresh={refresh} />
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