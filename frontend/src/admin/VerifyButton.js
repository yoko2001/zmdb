import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {context as globalContext} from '../context';
import RecordsApi from '../api/RecordsApi';

export const VerifyButton = ({recordId, refreshRecords}) => {

    const {onMessage} = React.useContext(globalContext);

    const onClick = (e) => {
        const token = prompt('请输入口令');
        if (token) {
            RecordsApi.verify(recordId, token).then(res => {
                refreshRecords();
                onMessage({
                    type: 'success',
                    content: '审核成功'
                });
            }).catch(err => {
                const error = err.response.data;
                onMessage({
                    type: 'error',
                    content: `[${error.code}] ${error.message}`
                });
            });
        }
    }

    return (
        <Tooltip title='审核'>
            <IconButton color='inherit' size='small' onClick={onClick}>
                <CheckIcon fontSize='small' />
            </IconButton>
        </Tooltip>
    );
}