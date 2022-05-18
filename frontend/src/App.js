import * as React from 'react';
import { Box, Link, Backdrop, CircularProgress  } from '@mui/material';
import axios from 'axios';
import { MainPanel } from './MainPanel';
import { SideBar } from './SideBar';
import { TopAppBar } from './TopAppBar';
import { MessageSnackbar } from './MessageSnackbar';
import { context } from './context';
import config from './config';

export const App = () => {
    
    const [organizations, setOrganizations] = React.useState([]);
    const [selectedOrganization, setSelectedOrganization] = React.useState([]);
    const [vups, setVups] = React.useState([]);
    const [selectedVups, setSelectedVups] = React.useState([]);
    const [searchWord, setSearchWord] = React.useState('');
    const [lives, setLives] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState({});
    const [messageStatus, setMessageStatus] = React.useState(false);

    const onMessage = (message) => {
        setMessage(message);
        setMessageStatus(true);
    };

    const onUpdateOrganizations = (organizations) => {
        setOrganizations(organizations);
        if (organizations.length > 0) {
            onSelectOrganization(organizations[0]);
        }
    }

    const onSelectOrganization = (selectedOrganization) => {
        setSelectedOrganization(selectedOrganization);
        setSearchWord('');
        axios.get(`${config.url.api}/organization/${selectedOrganization.id}/vups`).then(res => {
            const vups = res.data || [];
            onUpdateVups(vups);

            axios.get(`${config.url.api}/organization/${selectedOrganization.id}/lives`).then(res => {
                const lives = res.data || [];
                setLives(lives);
            });
        });
    }

    const onUpdateVups = (vups) => {
        setVups(vups);
        setSelectedVups(vups);
    }

    const onSearch = (searchWord) => {
        if (selectedVups.length > 0 && searchWord.length > 0) {
            setSearchWord(searchWord);
            const vupIds = selectedVups.map(selectedVup => selectedVup.id).join(',');
            setLoading(true);
            axios.get(`${config.url.api}/lives`, {
                params: {
                    vupIds: vupIds,
                    content: searchWord
                }
            }).then(res => {
                const lives = res.data || [];
                setLives(lives);
                setLoading(false);
                onMessage({
                    type: 'success',
                    content: `总共查询到${lives.length}条直播记录`
                });
            }).catch(e => {
                setLoading(false);
            });
        }
    }

    React.useEffect(() => {
        axios.get(`${config.url.api}/organizations`).then(res => {
            const organizations = res.data || [];
            onUpdateOrganizations(organizations);
        });
    }, []);

    const value = {
        organizations,
        selectedOrganization,
        vups,
        selectedVups,
        searchWord,
        lives,
        message,
        messageStatus,
        onSelectOrganization,
        onUpdateVups,
        onSearch,
        onMessage,
        setSelectedVups,
        setMessageStatus,
        setLoading
    };

    return (
        <context.Provider value={value}>
            <Box sx = {{ display: 'flex', flexDirection: 'column' }}>
                <Box sc={{ width:'100%' }}>
                    <TopAppBar />
                </Box>
                <Box sx = {{ display: 'flex', width:'100%' }}>
                    <Box sx={{ flex: 0, flexGrow: '1', p: '2rem 1rem' }}>
                        <SideBar />
                    </Box>
                    <Box sx={{ flex: 0, flexGrow: '4', p: '2rem 1rem' }}>
                        <MainPanel />
                    </Box>
                </Box>
                <Box sx = {{ display:'flex', witdh:'100%', justifyContent:'center', pb:'1rem', color:'rgba(0,0,0,.4)', fontSize:'0.8rem'}}>
                    <Box>
                        Copyright © 2022 sixiwanzi.live
                    </Box>
                    <Box sx={{ pl:'1rem', pr:'1rem'}}>
                        <Link color='rgba(0,0,0,.4)' href={`${config.url.vup}/95111328`} target='_blank' rel="noreferrer" underline='none'>@恬豆_千鸟Official</Link>
                    </Box>
                    <Box>
                        备案号:<Link color='rgba(0,0,0,.4)' href='https://beian.miit.gov.cn' target='_blank' underline='none' rel="noreferrer">京ICP证030173号</Link>
                    </Box>
                    
                </Box>
                <Backdrop 
                    sx={{ color: 'gray', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                    onClick={() => {}}
                >
                    <CircularProgress color="success" />
                </Backdrop>
                <MessageSnackbar />
            </Box>
        </context.Provider>
    );
}