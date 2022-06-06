import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RecordsApi from '../../api/RecordsApi';
import { context as globalContext } from '../../context';

export const DeleteOrganizationsButton = ({ organization, refresh }) => {

    const { onMessage } = React.useContext(globalContext);

    const onClick = (e) => {
        const remark = prompt('请输入删除理由');
        if (remark) {
            const entity = {
                id: organization.id,
                name: organization.name
            }
            RecordsApi.insert('organizations', 'delete', entity, remark).then(res => {
                onMessage({
                    type: 'success',
                    content: '已提交成功'
                });
                refresh();
            }).catch(err => {
                console.log(err);
                const error = err.response.data;
                onMessage({
                    type: 'error',
                    content: `[${error.code}] ${error.message}`
                });
            })
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