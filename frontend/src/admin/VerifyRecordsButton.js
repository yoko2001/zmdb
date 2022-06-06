import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RecordsApi from '../api/RecordsApi';
import { context as globalContext } from '../context';

export const VerifyRecordsButton = ({ record, refresh }) => {

    const { onMessage } = React.useContext(globalContext);

    const onClick = (e) => {
        const token = prompt('请输入口令');
        if (token) {
            RecordsApi.verify(record.id, token).then(res => {
                onMessage({
                    type: 'success',
                    content: '已审核成功'
                });
                refresh();
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
        <React.Fragment>
            <Tooltip title='审核'>
                {
                    record.verified === 0 ?
                        <IconButton color='primary' size='small' onClick={onClick}>
                            <CheckBoxIcon fontSize='small' />
                        </IconButton>
                    :
                        <IconButton color='primary' size='small' onClick={onClick} disabled>
                            <CheckBoxIcon fontSize='small' />
                        </IconButton>
                }   
            </Tooltip>
        </React.Fragment>
    )
}