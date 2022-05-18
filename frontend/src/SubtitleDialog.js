import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button'
import { SubtitleButtonGroup } from './SubtitleButtonGroup';
import { SubtitleTable } from './SubtitleTable';
import { context } from './context';

export const SubtitleDialog = ({live, subtitles, status, setStatus}) => {

    const { searchWord } = React.useContext(context);
    const [match, setMatch] = React.useState(0);
    const [matches, setMatches] = React.useState([]);
    const [markedSubtitles, setMarkedSubtitles] = React.useState([]);
    
    const onClose = () => {
        setMatch(0);
        setStatus(false);
    }

    React.useEffect(() => {
        if (searchWord.length > 0) {
            let matches = [];
            subtitles.forEach((subtitle, index) => {
                if (subtitle.content.indexOf(searchWord) !== -1) {
                    matches.push(index);
                }
            });
            setMatches(matches);
        }
        const markedSubtitles = subtitles.map(subtitle => {
            return {
                lineId: subtitle.lineId,
                start: subtitle.start,
                end: subtitle.end,
                content: subtitle.content.replaceAll(searchWord, `<mark>${searchWord}</mark>`)
            };
        });
        setMarkedSubtitles(markedSubtitles);
    }, [searchWord, subtitles]);

    React.useEffect(() => {
        if (status) {
            if (matches.length > 0) {
                setMatch(matches[0]);
            }
        }
    }, [status, matches]);

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='lg' open={status} onClose={onClose}>
            <DialogTitle>
                {live.title}
            </DialogTitle>
            <DialogContent>
                { matches.length > 0 ? <SubtitleButtonGroup matches={matches} setMatch={setMatch} /> : <></>}
                <SubtitleTable match={match} live={live} subtitles={markedSubtitles} />                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}