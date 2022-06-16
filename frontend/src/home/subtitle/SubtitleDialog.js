import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button'
import { SubtitleButtonGroup } from './SubtitleButtonGroup';
import { SubtitleTable } from './SubtitleTable';
import { context } from '../context';

export const SubtitleDialog = ({clip, subtitles, status, setStatus}) => {

    const { pinyinChecked } = React.useContext(context);
    const [match, setMatch] = React.useState(-1);
    
    const onClose = () => {
        setMatch(-1);
        setStatus(false);
    }

    React.useEffect(() => {
        subtitles.forEach(subtitle => {
            subtitle.markedContent = subtitle.markedContent
                                        .replaceAll('{', '<mark style="background-color: #C4F2CE">')
                                        .replaceAll('}', '</mark>')
                                        .replaceAll('[', '<mark>')
                                        .replaceAll(']', '</mark>');
            
        });
        for (let i = 0; i < subtitles.length; ++i) {
            if (pinyinChecked) {
                if (subtitles[i].matchMode === 1 || subtitles[i].matchMode === 2) {
                    setMatch(i);
                    break;
                }
            } else {
                if (subtitles[i].matchMode === 1) {
                    setMatch(i);
                    break;
                }
            }
        }
    }, [pinyinChecked, subtitles]);

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='lg' open={status} onClose={onClose}>
            <DialogTitle>
                {clip.title}
            </DialogTitle>
            <DialogContent>
                {match >= 0 && <SubtitleButtonGroup subtitles={subtitles} match={match} setMatch={setMatch} />}
                <SubtitleTable match={match} clip={clip} subtitles={subtitles} />                
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}