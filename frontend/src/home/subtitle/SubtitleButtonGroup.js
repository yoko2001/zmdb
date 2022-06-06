import * as React from 'react';
import { ButtonGroup, IconButton } from '@mui/material';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';

export const SubtitleButtonGroup = ({matches, setMatch}) => {

    const [cursor, setCursor] = React.useState(0);

    const onMatchDown = (e) => {
        if (cursor < matches.length - 1) {
            setCursor(prev => {
                const curr = prev + 1;
                setMatch(matches[curr]);
                return curr;
            });
        }
    }
    const onMatchUp = (e) => {
        if (cursor > 0) {
            setCursor(prev => {
                const curr = prev - 1;
                setMatch(matches[curr]);
                return curr;
            });
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