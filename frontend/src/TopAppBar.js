import * as React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export const TopAppBar = () => {
    return (
        <React.Fragment>
            <AppBar position='fixed'>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        字幕库
                    </Typography>
                    {/* <Button color="inherit">登录</Button> */}
                </Toolbar>
            </AppBar>
            <Toolbar /> {/** 避免AppBar压住下面的Box */}
        </React.Fragment>
    );
}