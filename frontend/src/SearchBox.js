import * as React from 'react';
import { Box } from '@mui/material';
import { VupSelector } from './VupSelector';
import { SearchText } from './SearchText';

export const SearchBox = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flex: 0, flexGrow: 1, pr: '1rem' }}>
                <VupSelector />
            </Box>
            <Box sx={{ flex: 0, flexGrow: 3, pl: '1rem' }}>
                <SearchText />
            </Box>
        </Box>
    );
}