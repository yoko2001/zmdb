import * as React from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input, TextField } from '@mui/material';
import { context as globalContext } from '../../context';
import FilesApi from '../../api/FilesApi';
import RecordsApi from '../../api/RecordsApi';

export const AddOrganizationsDialog = ({ status, setStatus }) => {

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
        try {
            const res1 = await FilesApi.upload(file);
            const filename = res1.data.filename;
            const entity = {
                name, filename
            };
            await RecordsApi.insert('organizations', 'insert', entity, remark);
            clear();
            setLoading(false);
            
            onMessage({
                type: 'success',
                content: '已提交申请，待审核'
            });
        } catch (ex) {
            console.log(ex.response);
            clear();
            setLoading(false);
            onMessage({
                type: 'error', 
                content: ex.response.data
            })
        }
    }

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='sm' open={status} onClose={onClose}>
            <DialogTitle>
                新增社团/组
            </DialogTitle>
            <DialogContent>
                <Box sx={{ width: '100%', m: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        id="name-textfield"
                        label="名称"
                        type='search'
                        margin='normal'
                        onChange={onChangeName}
                    />
                    <label htmlFor="avatar-file-input">
                        <Box sx={{ width:'100%', display:'flex'}}>
                        <Input sx={{display:'none'}} accept="image/*" id="avatar-file-input" type="file" onChange={onChangeFile}/>
                        <Button sx={{ mr:'1rem'}}variant="contained" component="span">
                            选择头像
                        </Button>
                        <p>{file.name}</p>
                        </Box>
                    </label>
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