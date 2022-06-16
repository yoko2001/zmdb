import * as React from 'react';
import { Switch, FormGroup, FormControlLabel } from '@mui/material';
import { context } from '../context';

export const PinyinSwitch = () => {

    const { pinyinChecked, setPinyinChecked } = React.useContext(context);

    const onChange = (e) => {
        setPinyinChecked(e.target.checked);
    }

    return (
        <FormGroup>
            <FormControlLabel control={<Switch color='success' checked={pinyinChecked} onChange={onChange}/>} label="拼音" labelPlacement="bottom" />
        </FormGroup>
    )
}