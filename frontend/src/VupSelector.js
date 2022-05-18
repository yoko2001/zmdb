import * as React from 'react';
import { Paper, FormControl, InputLabel, Select, OutlinedInput, Box, Avatar, MenuItem } from '@mui/material';
import { context } from './context';
import config from './config';

export const VupSelector = () => {

    const { vups, selectedVups, setSelectedVups } = React.useContext(context);
    
    const onChanged = (e) => {
        setSelectedVups(e.target.value);        
    };

    return (
        <Paper sx={{ width:'100%' }}>
            <FormControl sx={{ display:'flex', flex:1 }}>
                <InputLabel id="vup-selector-label">请选择直播间</InputLabel>
                <Select
                    sx={{ flex:0 }}
                    labelId='vup-selector-label'
                    id='vup-selector'
                    multiple
                    value={selectedVups}
                    onChange={onChanged}
                    input={<OutlinedInput id="vup-selector" label="请选择直播间" />}
                    renderValue={selectedVups => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            { selectedVups.map(selectedVup => (
                                <Avatar sx={{ width: '1.5rem', height: '1.5rem'}} key={selectedVup.id} src={`${config.url.file}/vups/${selectedVup.uid}.webp`} />
                            ))}
                        </Box>
                    )}
                >
                    { vups.map(vup => (
                        <MenuItem key={vup.id} value={vup} >
                            <Avatar sx={{ width: '1.5rem', height: '1.5rem', mr: '0.5rem'}} src={`${config.url.file}/vups/${vup.uid}.webp`} />{vup.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    );
}