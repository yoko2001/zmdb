import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import { context as globalContext } from '../../context';
import { toSrt } from '../../utils';
import SubtitlesApi from '../../api/SubtitleApi';

export const SubtitleDownloadButton = ({ clip, subtitleMap }) => {

    const { setLoading, onMessage } = React.useContext(globalContext);

    const download = (subtitles) => {
        const blob = new Blob([toSrt(subtitles)]);
        const virtualUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = virtualUrl;
        a.setAttribute('download', `${clip.id}.srt`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    const onClick = () => {
        if (subtitleMap.has(clip.id)) {
            const subtitles = subtitleMap.get(clip.id);
            download(subtitles);
        } else {
            setLoading(true);
            SubtitlesApi.findByClipId(clip.id).then(res => {
                const subtitles = res.data || [];
                subtitleMap.set(clip.id, subtitles);
                setLoading(false);
                download(subtitles);
            }).catch(res => {
                console.log(res);
                setLoading(false);
                const error = res.response.data;
                onMessage({
                    type: 'error',
                    content: `[${error.code}] ${error.message}`
                });
            });
        }
    }

    return (
        <Tooltip title='下载字幕文件'>
            <IconButton color='inherit' size='xs' onClick={onClick}>
                <SubtitlesOutlinedIcon />
            </IconButton>
        </Tooltip>
    );
}