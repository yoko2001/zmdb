import * as React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { context } from './context';
import config from '../config';

export const Sidebar = () => {

    const { organizations } = React.useContext(context);
    const params = useParams();

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <List component='nav'>
                { organizations.map(organization => (
                    <ListItem disablePadding key={organization.id}>
                        <ListItemButton 
                            component={RouterLink}
                            to={`/organizations/${organization.id}`}
                            selected={organization.id === params.organizationId}
                        >
                            <ListItemAvatar>
                                <Avatar src={`${config.url.file}/organizations/${organization.id}.webp`}/>
                            </ListItemAvatar>
                            <ListItemText primary={organization.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}