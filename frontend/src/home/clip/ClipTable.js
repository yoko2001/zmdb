import * as React from 'react';
import { Box, Link, Avatar, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { TitleButton } from './TitleButton';
import { context } from '../context';
import config from '../../config';
import { SubtitleDownloadButton } from './SubtitleDownloadButton';

export const ClipTable = () => {

    const { selectedAuthors, clips } = React.useContext(context);
    const subtitleMapRef = React.useRef(new Map());

    const rows = clips
        .filter(clip => selectedAuthors.map(author => author.id).includes(clip.authorId))
        .map(clip => {
            const datetime = clip.datetime.split(' ');
            return {
                id : clip.id,
                date: datetime[0],
                time: datetime[1],
                author: clip.author,
                bv: clip.bv,
                avatar: clip,
                title: clip,
                operations: clip
            };
        });

    const columns = [
        { field: 'date', headerName: '日期', flex:1, headerAlign:'center', align:'center' },
        { field: 'time', headerName: '时间', flex:1, headerAlign:'center', align:'center' },
        { field: 'author', headerName: '直播间', flex:0.7, headerAlign:'center', align:'center', renderCell: params=> (
            params.value &&
            <Link href={`${config.url.author}/${params.value.uid}`} underline='none' rel='noopener' target='_blank'><Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`${config.url.file}/authors/${params.value.organizationId}/${params.value.id}.webp`} alt={params.value.name} /></Link>
        )},
        { field: 'bv', headerName: 'BV号', flex: 1.5, headerAlign:'center', align:'center', renderCell: (params) => (
            params.value &&
            <Link href={`${config.url.clip}/${params.value}`} rel ="noreferrer" target='_blank' sx={{ fontFamily:'monospace' }}>{params.value}</Link>
        )},
        { field: 'avatar', headerName: '封面', flex:1.5, headerAlign:'center', align:'center', renderCell: params=> (
            params.value && 
            <Avatar sx={{ width:'3rem', height:'2rem'}} src={`${config.url.file}/clips/${params.value.author.organizationId}/${params.value.author.id}/${params.value.id}.webp`}/>
        )},
        { field:'title', headerName:'标题', flex:4, renderCell:params => (
            params.value &&
            <TitleButton clip={params.value} subtitleMap={subtitleMapRef.current} />
        )},
        { field:'operations', headerName:'操作', flex:1.2, headerAlign:'center', align:'center',renderCell:params => (
            params.value &&
            <Stack direction='row' spacing={0.5}>
                <SubtitleDownloadButton clip={params.value} subtitleMap={subtitleMapRef.current} />
            </Stack>
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