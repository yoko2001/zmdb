import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { UpdateAuthorsDialog } from './UpdateAuthorsDialog';

export const UpdateAuthorsButton = ({author, refresh}) => {

    const [status, setStatus] = React.useState(false);

    const onClick = (e) => {
        setStatus(true);
    }

    return (
        <React.Fragment>
            <Tooltip title='修改'>
                <IconButton color='primary' size='small' onClick={onClick}>
                    <ContentCutIcon fontSize='small' />
                </IconButton>
            </Tooltip>
            <UpdateAuthorsDialog
                author={author}
                status={status}
                setStatus={setStatus}
                refresh={refresh}
            />
        </React.Fragment>
    )
}