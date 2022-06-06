import * as React from 'react';
import { Button } from "@mui/material"
import { AddOrganizationsDialog } from './AddOrganizationsDialog';
import AddCircle from '@mui/icons-material/AddCircle';

export const AddOrganizationsButton = ({refresh}) => {

    const [status, setStatus] = React.useState(false);

    const onClick = (e) => {
        setStatus(true);
    }

    return (
        <React.Fragment>
            <Button variant='contained' startIcon={<AddCircle />} onClick={onClick}>新增社团/组</Button>
            <AddOrganizationsDialog status={status} setStatus={setStatus} refresh={refresh}/>
        </React.Fragment>
    )
}