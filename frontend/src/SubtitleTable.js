import * as React from 'react';
import { Box, Divider, Link } from '@mui/material';
import { FixedSizeList } from 'react-window';
import config from './config';

const toTime = (timestamp) => {
    const ms = parseInt(timestamp % 1000);
    timestamp = parseInt(timestamp / 1000);
    const s = parseInt(timestamp % 60);
    timestamp = parseInt(timestamp/ 60);
    const m = parseInt(timestamp % 60);
    const h = parseInt(timestamp / 60);
    return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}.${ms.toString().padStart(3, 0)}`;
}

export const SubtitleTable = ({match, live, subtitles}) => {

    const listRef = React.useRef();

    React.useEffect(() => {
        listRef.current.scrollToItem(match);
    });

    const Row = ({index, style, data}) => {
        const backgroundColor = match === data.subtitles[index].lineId - 1 ? '#F5F5F5' : '#FFFFFF';
        return (
            <div style={style}>
                <Box sx={{ display:'flex', backgroundColor:{backgroundColor} }}>
                    <Box sx={{ flex:1 }}>{data.subtitles[index].lineId}</Box>
                    <Box sx={{ flex:3 }}><Link target='_blank' underline="hover" rel ="noreferrer" href={`${config.url.live}/${data.live.bv}?start_progress=${data.subtitles[index].start}`}>{toTime(data.subtitles[index].start)}</Link></Box>
                    <Box sx={{ flex:3 }}><Link target='_blank' underline="hover" rel ="noreferrer" href={`${config.url.live}/${data.live.bv}?start_progress=${data.subtitles[index].end}`}>{toTime(data.subtitles[index].end)}</Link></Box>
                    <Box sx={{ flex:14 }} dangerouslySetInnerHTML={{__html:data.subtitles[index].content}} />
                </Box>
            </div>
        )
    }

    return (
        <Box sx={{ width:'100%'}}>
            <Box sx={{ display:'flex' }}>
                <Box sx={{ flex:1 }}>序号</Box>
                <Box sx={{ flex:3 }}>起始时间</Box>
                <Box sx={{ flex:3 }}>结束时间</Box>
                <Box sx={{ flex:14 }}>字幕</Box>
            </Box>
            <Box sx={{ mt:'1rem', mb:'1rem'}}>
                <Divider />
            </Box>
            <FixedSizeList
                ref={listRef}
                height={300}
                itemCount={subtitles.length}
                itemSize={25}
                width={'100%'}
                itemData={{
                    live: live, 
                    subtitles:subtitles
                }}
            >
                {Row}
            </FixedSizeList>
        </Box>
    )
}