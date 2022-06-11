import * as React from 'react';
import { Button } from '@mui/material';
import { context as globalContext } from '../../context';
import SubtitlesApi from '../../api/SubtitleApi';
import { SubtitleDialog } from '../subtitle/SubtitleDialog';

export const TitleButton = ({clip, subtitleMap}) => {

    const [status, setStatus] = React.useState(false);
    const {setLoading, onMessage} = React.useContext(globalContext);

    const onClick = () => {
        if (!subtitleMap.has(clip.id)) {
            setLoading(true);
            SubtitlesApi.findByClipId(clip.id).then(res => {
                const subtitles = res.data || [];
                subtitleMap.set(clip.id, subtitles);
                setLoading(false);
                setStatus(true);
            }).catch(res => {
                console.log(res);
                setLoading(false);
                const error = res.response.data;
                onMessage({
                    type: 'error',
                    content: `[${error.code}] ${error.message}`
                });
            });
        } else {
            setStatus(true);
        }
    }

    return (
        <React.Fragment>
            <Button variant='text' onClick={onClick}>{clip.title}</Button>
            <SubtitleDialog status={status} setStatus={setStatus} clip={clip} subtitles={subtitleMap.get(clip.id) || []} />
        </React.Fragment>
    )
}