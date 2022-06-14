import * as React from 'react';
import { ButtonGroup, IconButton } from '@mui/material';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';

export const SubtitleButtonGroup = ({subtitles, match, setMatch}) => {

    const onMatchDown = (e) => {
        for (let i = match + 1; i < subtitles.length; ++i) {
            if (subtitles[i].matchMode !== 1 && subtitles[i].matchMode !== 2) {
                continue;
            }
            console.log(`match:${i}`);
            setMatch(i);
            break;
        }
    }

    const onMatchUp = (e) => {
        for (let i = match - 1; i >= 0; --i) {
            if (subtitles[i].matchMode !== 1 && subtitles[i].matchMode !== 2) {
                continue;
            }
            setMatch(i);
            break;
        }
    }

    return (
        <ButtonGroup>
            <IconButton color="primary" aria-label="上一条匹配" onClick={onMatchUp}>
                <ArrowCircleUpOutlinedIcon />
            </IconButton>
            <IconButton color="primary" aria-label="下一条匹配" onClick={onMatchDown}>
                <ArrowCircleDownOutlinedIcon />
            </IconButton>
        </ButtonGroup>
    );
}