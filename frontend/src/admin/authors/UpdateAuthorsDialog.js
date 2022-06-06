import * as React from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Input, InputLabel, Select, MenuItem, TextField, Divider } from '@mui/material';
import { context as globalContext } from '../../context';
import config from '../../config';
import FilesApi from '../../api/FilesApi';
import RecordsApi from '../../api/RecordsApi';
import OrganizationsApi from '../../api/OrganizationsApi';

export const UpdateAuthorsDialog = ({ status, setStatus, author, refresh }) => {

    const { onMessage, setLoading } = React.useContext(globalContext);

    const [file, setFile] = React.useState({});
    const [name, setName] = React.useState('');
    const [uid, setUid] = React.useState('');
    const [organizationId, setOrganizationId] = React.useState(0);
    const [remark, setRemark] = React.useState('');
    const [organizations, setOrganizations] = React.useState([]);
    
    const onChangeName = (e) => {
        setName(e.target.value || '');
    }
    const onChangeUid = (e) => {
        setUid(e.target.value || '');
    }
    const onChangeOrganizationId = (e) => {
        setOrganizationId(e.target.value);
    }
    const onChangeFile = (e) => {
        setFile(e.target.files[0]);
    }
    const onChangeRemark = (e) => {
        setRemark(e.target.value || '');
    }

    React.useEffect(() => {
        OrganizationsApi.findAll().then(res => {
            const organizations = res.data || [];
            setOrganizations(organizations);
            setOrganizationId(author.organizationId);
        }).catch(ex => {
            const error = ex.response.data;
            onMessage({
                type: 'error',
                content: `[${error.code}] ${error.message}`
            });
        })
    }, []);

    const onClose = () => {
        clear();
        setStatus(false);
    }

    const clear = () => {
        setName('');
        setUid('');
        setOrganizationId(author.organizationId);
        setFile({});
        setRemark('');
    }

    const onSubmit = async () => {
        setStatus(false);
        setLoading(true);
        let entity = {};
        console.log(name);
        console.log(author.name);
        if (name.length !== 0) {
            entity.name = name;
        }
        if (uid.length !== 0) {
            entity.uid = uid;
        }
        if (organizationId !== author.organizationId) {
            entity.organizationId = organizationId;
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
                entity.id = author.id;
                await RecordsApi.insert('authors', 'update', entity, remark);
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
                修改主播/视频作者
            </DialogTitle>
            <DialogContent>
                <Box sx={{ width:'90%', m:'1rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                    <TextField
                        fullWidth
                        id="name-textfield"
                        label="名称"
                        type='search'
                        margin='normal'
                        size='small'
                        onChange={onChangeName}
                        defaultValue={author.name}
                    />
                    <TextField
                        fullWidth
                        id="uid-textfield"
                        label="uid"
                        type='search'
                        margin='normal'
                        size='small'
                        onChange={onChangeUid}
                        defaultValue={author.uid}
                    />
                    <InputLabel id="organizations-select-label">社团/组</InputLabel>
                    <Select
                        labelId="organizations-select-label"
                        id="organizations-select"
                        value={organizationId}
                        label="社团/组"
                        size='small'
                        onChange={onChangeOrganizationId}
                        defaultValue={author.organizationId}
                    >
                        {
                            organizations.map(organization => (
                                <MenuItem value={organization.id}>{organization.name}</MenuItem>
                            ))
                        }
                    </Select>
                    <label htmlFor="avatar-file-input">
                        <Box sx={{ width: '100%', display: 'flex' }}>
                            <Input sx={{ display: 'none' }} accept="image/*" id="avatar-file-input" type="file" onChange={onChangeFile} />
                            <Button sx={{ mr: '1rem' }} variant="contained" component="span">
                                选择头像
                            </Button>
                        </Box>
                    </label>
                    <Divider sx={{ mt: '2rem', mb: '0.5rem' }} />
                    <TextField
                        fullWidth
                        id="remark-textfield"
                        label="备注"
                        type='search'
                        margin='normal'
                        size='small'
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