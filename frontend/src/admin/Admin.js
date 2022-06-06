import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { AdminTabs } from './AdminTabs';

export const Admin = () => {

    const params = useParams();

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ flex: 0, flexGrow: '1', p: '2rem 1rem' }}>
                <Sidebar />
            </Box>
            <Box sx={{ flex: 0, flexGrow: '4', p: '2rem 1rem' }}>
                <AdminTabs target={params.target}/>
                {/* <RecordsTable
                    records={records}
                    refreshRecords={refreshRecords}
                    target={params.target}
                /> */}
            </Box>
        </Box>
    );
}