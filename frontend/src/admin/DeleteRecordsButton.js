import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RecordsApi from '../api/RecordsApi';
import { context as globalContext } from '../context';

export const DeleteRecordsButton = ({ record, refresh }) => {

    const { onMessage } = React.useContext(globalContext);

    const onClick = (e) => {
        const token = prompt('请输入口令');
        if (token) {
            RecordsApi.deleteById(record.id, token).then(res => {
                onMessage({
                    type: 'success',
                    content: '已删除成功'
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
            <Tooltip title='删除'>
                <IconButton color='primary' size='small' onClick={onClick}>
                    <DeleteIcon fontSize='small' />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}