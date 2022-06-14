import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import config from '../../config';

export const SubtitleDownloadButton = ({ clip }) => {

    return (
        <Tooltip title='下载字幕文件'>
            <IconButton color='primary' size='xs' component='a' href={`${config.url.file}/srt/${clip.author.organizationId}/${clip.authorId}/${clip.id}.srt`} target='_blank'>
                <SubtitlesOutlinedIcon />
            </IconButton>
        </Tooltip>
    );
}