import * as React from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input, TextField, Divider } from '@mui/material';
import { context as globalContext } from '../../context';
import config from '../../config';
import FilesApi from '../../api/FilesApi';
import RecordsApi from '../../api/RecordsApi';

export const UpdateOrganizationsDialog = ({ status, setStatus, organization, refresh }) => {

    const { onMessage, setLoading } = React.useContext(globalContext);

    const [file, setFile] = React.useState({});
    const [name, setName] = React.useState('');
    const [remark, setRemark] = React.useState('');
    
    const onChangeName = (e) => {
        setName(e.target.value || '');
    }
    const onChangeFile = (e) => {
        setFile(e.target.files[0]);
    }
    const onChangeRemark = (e) => {
        setRemark(e.target.value || '');
    }

    const onClose = () => {
        clear();
        setStatus(false);
    }

    const clear = () => {
        setName('');
        setFile({});
        setRemark('');
    }

    const onSubmit = async () => {
        setStatus(false);
        setLoading(true);
        let entity = {};
        if (name.length !== 0) {
            entity.name = name;
        }
        if (Object.keys(file).length !== 0) {
            try {
                const r = await FilesApi.uploadImage(file);
                entity.filename = r.data.filename;
            } catch (ex) {
                onMessage({
                    type: 'error', 
                    content: ex.response.data
                });
            }
        }
        if (Object.keys(entity).length !== 0) {
            try {
                entity.id = organization.id;
                await RecordsApi.insert('organizations', 'update', entity, remark);
                onMessage({
                    type: 'success',
                    content: '已提交申请，待审核'
                });
                refresh();
            } catch (ex) {
                onMessage({
                    type: 'error', 
                    content: ex.response.data
                });
            }
        }
        clear();
        setLoading(false);
    }

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='sm' open={status} onClose={onClose}>
            <DialogTitle>
                修改社团/组
            </DialogTitle>
            <DialogContent>
                <Box sx={{ width:'90%', m:'1rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <TextField
                        fullWidth
                        id="name-textfield"
                        label="名称"
                        type='search'
                        margin='normal'
                        onChange={onChangeName}
                        defaultValue={organization.name}
                    />
                    <label htmlFor="avatar-file-input">
                        <Box sx={{ width:'100%', display:'flex'}}>
                        <Input sx={{display:'none'}} accept="image/*" id="avatar-file-input" type="file" onChange={onChangeFile}/>
                        <Button sx={{ mr:'1rem'}}variant="contained" component="span">
                            选择头像
                        </Button>
                        <p>{`${config.url.file}/organizations/${organization.id}.webp`}</p>
                        </Box>
                    </label>
                    <Divider sx={{mt:'2rem', mb:'0.5rem'}}/>
                    <TextField
                        fullWidth
                        id="remark-textfield"
                        label="备注"
                        type='search'
                        margin='normal'
                        onChange={onChangeRemark}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit}>确认</Button>
                <Button onClick={onClose}>取消</Button>
            </DialogActions>
        </Dialog>
    )
}