import * as React from 'react';
import { Button } from "@mui/material"
import { AddAuthorsDialog } from './AddAuthorsDialog';
import AddCircle from '@mui/icons-material/AddCircle';

export const AddAuthorsButton = ({refresh}) => {

    const [status, setStatus] = React.useState(false);

    const onClick = (e) => {
        setStatus(true);
    }

    return (
        <React.Fragment>
            <Button variant='contained' startIcon={<AddCircle />} onClick={onClick}>新增主播/视频作者</Button>
            <AddAuthorsDialog status={status} setStatus={setStatus} refresh={refresh}/>
        </React.Fragment>
    )
}