import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RecordsApi from '../api/RecordsApi';
import { context as globalContext } from '../context';

export const CloseRecordsButton = ({ record, refresh }) => {

    const { onMessage } = React.useContext(globalContext);

    const onClick = (e) => {
        const comment = prompt('请输入回复');
        const token = prompt('请输入口令');
        if (token) {
            RecordsApi.close(record.id, comment, token).then(res => {
                onMessage({
                    type: 'success',
                    content: '已关闭成功'
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
            <Tooltip title='关闭'>
                {
                    record.verified === 0 ?
                        <IconButton color='primary' size='small' onClick={onClick}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    :
                        <IconButton color='primary' disabled size='small' onClick={onClick}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                }
            </Tooltip>
        </React.Fragment>
    )
}