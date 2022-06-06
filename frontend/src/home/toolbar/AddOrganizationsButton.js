import * as React from 'react';
import { Button } from "@mui/material"
import { AddOrganizationsDialog } from './AddOrganizationsDialog';

export const AddOrganizationsButton = () => {

    const [status, setStatus] = React.useState(false);

    const onClick = (e) => {
        setStatus(true);
    }

    return (
        <React.Fragment>
            <Button onClick={onClick}>新增社团/组</Button>
            <AddOrganizationsDialog status={status} setStatus={setStatus} />
        </React.Fragment>
    )
}