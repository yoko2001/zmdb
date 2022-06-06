import * as React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArticleIcon from '@mui/icons-material/Article';

export const Sidebar = () => {

    const params = useParams();

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <List component='nav'>
                <ListItem key={1} disablePadding>
                    <ListItemButton 
                        component={RouterLink}
                        to='/admin/organizations'
                        selected={params.target === 'organizations'}
                    >
                        <ListItemIcon>
                            <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'社团/组'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={2} disablePadding>
                    <ListItemButton 
                        component={RouterLink}
                        to='/admin/authors'
                        selected={params.target === 'authors'}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={'主播/视频作者'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={3} disablePadding>
                    <ListItemButton 
                        component={RouterLink}
                        to='/admin/clips'
                        selected={params.target === 'clips'}
                    >
                        <ListItemIcon>
                            <VideocamIcon />
                        </ListItemIcon>
                        <ListItemText primary={'录播/视频'}  />
                    </ListItemButton>
                </ListItem>
                <ListItem key={4} disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to='/admin/subtitils'
                        selected={params.target === 'subtitles'}
                    >
                        <ListItemIcon>
                            <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary={'字幕'}  />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}