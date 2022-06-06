import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Button from '@mui/material/Button'

export const RecordDetailDialog = ({ record, status, setStatus }) => {

    const onClose = () => {
        setStatus(false);
    }

    const entity = JSON.parse(record.entity);
    if (status) {

        console.log(entity);
    }

    return (
        <Dialog fullscreen='true' fullWidth={true} maxWidth='sm' open={status} onClose={onClose}>
            <DialogTitle>
                提交信息
            </DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx={{ width:'100%', mt:'0.1rem' }} aria-label="提交记录表">
                        <TableHead>
                            <TableRow>
                                <TableCell>修改项</TableCell>
                                <TableCell>值</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(entity).map(key => (
                                <TableRow key={key} >
                                    <TableCell>{key}</TableCell>
                                    <TableCell align="left">{entity[key]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}