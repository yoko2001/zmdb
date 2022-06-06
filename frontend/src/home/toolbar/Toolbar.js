import { Button, ButtonGroup } from "@mui/material"
import { AddOrganizationsButton } from "./AddOrganizationsButton"

export const Toolbar = () => {
    return (
        <ButtonGroup size='small' variant="contained" aria-label="outlined primary button group">
            <AddOrganizationsButton />
            <Button>新增主播/作者</Button>
            <Button>新增录播/视频</Button>
        </ButtonGroup>
    )
}