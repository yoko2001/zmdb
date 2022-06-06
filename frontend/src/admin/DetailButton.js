import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { RecordDetailDialog } from './RecordDetailDialog';

export const DetailButton = ({record}) => {

    const [status, setStatus] = React.useState(false);

    const onClick = (e) => {
        setStatus(true);
    }

    return (
        <React.Fragment>
            <Tooltip title='查看'>
                <IconButton color='inherit' size='small' onClick={onClick}>
                    <PreviewIcon fontSize='small' />
                </IconButton>
            </Tooltip>
            <RecordDetailDialog 
                record={record}
                status={status}
                setStatus={setStatus}
            />
        </React.Fragment>
    );
}