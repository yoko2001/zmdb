import * as React from 'react';
import { Box } from '@mui/material';
import { AuthorsSelector } from './AuthorsSelector';
import { SearchText } from './SearchText';
import { PinyinSwitch } from './PinyinSwitch';

export const SearchBox = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flex: 0, flexGrow: 4, pr: '1rem' }}>
                <AuthorsSelector />
            </Box>
            <Box sx={{ flex: 0, flexGrow: 9, pl: '1rem' }}>
                <SearchText />
            </Box>
            <Box sx={{ flex: 0, flexGrow: 1 }}>
                <PinyinSwitch />
            </Box>
        </Box>
    );
}