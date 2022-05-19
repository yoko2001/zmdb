import * as React from 'react';
import { Box, Button, Link, Chip, Avatar, Stack, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import axios from 'axios';
import { SubtitleDialog } from './SubtitleDialog';
import { context } from './context';
import config from './config';

const SubtitleLink = ({live, subtitleMap}) => {

    const [status, setStatus] = React.useState(false);
    const {setLoading} = React.useContext(context);

    const onClick = () => {
        if (!subtitleMap.has(live.id)) {
            setLoading(true);
            axios.get(`${config.url.api}/live/${live.id}/subtitles`).then(res => {
                const subtitles = res.data || [];
                subtitleMap.set(live.id, subtitles);
                setLoading(false);
                setStatus(true);
            });
        } else {
            setStatus(true);
        }
    }

    return (
        <React.Fragment>
            <Button variant='text' onClick={onClick}>{live.title}</Button>
            <SubtitleDialog status={status} setStatus={setStatus} live={live} subtitles={subtitleMap.get(live.id) || []} />
        </React.Fragment>
    )
}

export const LiveTable = () => {

    const { vups, selectedVups, lives } = React.useContext(context);
    const subtitleMapRef = React.useRef(new Map());

    const vupMap = new Map();
    vups.forEach(vup => vupMap.set(vup.id, vup));

    const rows = lives
        .filter(live => selectedVups.map(vup => vup.id).includes(live.vupId))
        .map(live => {
            const datetime = live.datetime.split(' ');
            const vup = vupMap.get(live.vupId);
            return {
                id : live.id,
                date: datetime[0],
                time: datetime[1],
                vup: vupMap.get(live.vupId),
                bv: live.bv,
                verified: live.verified,
                title: live,
                operations: {
                    srtUrl: `${config.url.file}/srt/${vup.organizationId}/${vup.uid}/${live.bv}.srt`
                }
            };
        });

    const columns = [
        { field: 'date', headerName: '日期', flex:1, headerAlign:'center', align:'center' },
        { field: 'time', headerName: '时间', flex:1, headerAlign:'center', align:'center' },
        { field: 'vup', headerName: '直播间', flex:0.7, headerAlign:'center', align:'center', renderCell: params=> (
            params.value ? 
            <Link href={`${config.url.vup}/${params.value.uid}`} underline='none' rel='noopener' target='_blank'><Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/vups/${params.value.uid}.webp`} alt={params.value.name} /></Link>
            : <></>
        )},
        { field: 'bv', headerName: 'BV号', flex: 1.5, headerAlign:'center', align:'center', renderCell: (params) => (
            params.value ?
            <Link href={`${config.url.live}/${params.value}`} rel ="noreferrer" target='_blank'>{params.value}</Link>
            : <></>
        )},
        { field:'verified', headerName:'字幕校验', flex:1, headerAlign:'center', align:'center', renderCell:(params) => (
            params.value === 0 ?
            <Chip variant="outlined" color='warning' size='small' label='未校验' /> : 
            <Chip variant="outlined" color='success' size='small' label='已校验' />
        )},
        { field:'title', headerName:'标题', flex:4, renderCell:params => (
            params.value ?
            <SubtitleLink live={params.value} subtitleMap={subtitleMapRef.current} />
            : <></>
        )},
        { field:'operations', headerName:'操作', flex:1.2, headerAlign:'center', align:'center',renderCell:params => (
            params.value ?
            <Stack direction='row' spacing={0.5}>
                <Tooltip title='下载字幕文件'>
                    <IconButton color='inherit' size='small' component='a' href={params.value.srtUrl} target='_blank'>
                        <SubtitlesOutlinedIcon fontSize='small' />
                    </IconButton>
                </Tooltip>
                {/* <Tooltip title='下载视频'>
                    <IconButton color='inherit' size='small' component='a' href='' target='_blank'>
                        <FileDownloadOutlinedIcon fontSize='small' />
                    </IconButton>
                </Tooltip> */}
            </Stack>
            : <></>
        )}
    ];

    return (
        <Box sx={{ width:'100%' }}>
            <DataGrid 
                autoHeight 
                rows={rows} 
                columns={columns} 
                pageSize={10} 
                rowsPerPageOptions={[10]} 
                disableSelectionOnClick={true} 
            />
        </Box>
    )
}