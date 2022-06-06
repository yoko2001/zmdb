import * as React from 'react';
import { Box, Avatar, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOrganizationsButton } from './DeleteOrganizationsButton';
import { UpdateOrganizationsButton } from './UpdateOrganizationsButton';
import config from '../../config';

export const OrganizationsTable = ({organizations, refresh}) => {
    
    const rows = organizations
        .map(organization => {
            return {
                id: organization.id,
                name: organization.name,
                avatar: organization,
                operations: organization
            };
        });

    const columns = [
        { field: 'id', headerName: 'ID', flex:1, headerAlign:'center', align:'center' },
        { field: 'name', headerName: '名称', flex:3, headerAlign:'center', align:'center' },
        { field: 'avatar', headerName: '缩略图', flex:2, headerAlign:'center', align:'center', renderCell: params=> (
            params.value && <Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/img/organizations/${params.value.id}.webp`} alt={params.value.name} />
        )},
        { field:'operations', headerName:'操作', flex:1, headerAlign:'center', align:'center',renderCell:params => (
            params.value &&
            <Stack direction='row' spacing={0.5}>
                <UpdateOrganizationsButton organization={params.value} refresh={refresh} />
                <DeleteOrganizationsButton organization={params.value} refresh={refresh} />
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