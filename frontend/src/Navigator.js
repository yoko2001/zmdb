import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { context } from './context';
import config from './config';

export const Navigator = () => {

    const { organizations, selectedOrganization, onSelectOrganization } = React.useContext(context);

    const onClick = (e, organization) => {
        onSelectOrganization(organization);
    }

    return (
        <List component='nav'>
            { organizations.map(organization => (
                <ListItem disablePadding key={organization.id}>
                    <ListItemButton 
                        selected={selectedOrganization.id == organization.id}
                        onClick={e => onClick(e, organization)}
                    >
                        <ListItemAvatar>
                            <Avatar src={`${config.url.file}/organizations/${organization.id}.webp`}/>
                        </ListItemAvatar>
                        <ListItemText primary={organization.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}