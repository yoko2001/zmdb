import * as React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { AdminTabPanel } from './AdminTabPanel';
import { OrganizationsTable } from './organizations/OrganizationsTable';
import { AuthorsTable } from './authors/AuthorsTable';
import { ClipsTable } from './clips/ClipsTable';
import { OrganizationsRecordsTable } from './organizations/OrganizationsRecordsTable';
import { AuthorsRecordsTable } from './authors/AuthorsRecordsTable';
import OrganizationsApi from '../api/OrganizationsApi';
import AuthorsApi from '../api/AuthorsApi';
import ClipsApi from '../api/ClipsApi';
import RecordsApi from '../api/RecordsApi';
import { context as globalContext } from '../context';
import { AddOrganizationsButton } from './organizations/AddOrganizationsButton';
import { AddAuthorsButton } from './authors/AddAuthorsButton';

export const AdminTabs = ({ target }) => {

    const [value, setValue] = React.useState(0);
    const [entities, setEntities] = React.useState([]);
    const [records, setRecords] = React.useState([]);

    const { onMessage } = React.useContext(globalContext);

    const onChange = (e, newValue) => {
        setValue(newValue);
    }

    const refreshRecords = () => {
        RecordsApi.findByTarget(target).then(res => {
            const records = res.data || [];
            setRecords(records);
        }).catch(err => {
            const error = err.response.data;
            onMessage({
                type: 'error',
                content: `[${error.code}] ${error.message}`
            });
        });
    }

    const refreshEntities = () => {
        let p1 = {};
        if (target === 'organizations') {
            p1 = OrganizationsApi.findAll();
        } else if (target === 'authors') {
            p1 = AuthorsApi.findAll();
        } else if (target === 'clips') {
            p1 = ClipsApi.findAll();
        } else {
            return;
        }
        p1.then(res => {
            const entities = res.data || [];
            console.log(entities);
            setEntities(entities);
        }).catch(err => {
            const error = err.response.data;
            onMessage({
                type: 'error',
                content: `[${error.code}] ${error.message}`
            });
        });
    }

    const refresh = () => {
        refreshEntities();
        refreshRecords();
    }

    React.useEffect(() => {
        refresh();
    }, [target]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={onChange} aria-label="admin tabs">
                    <Tab label="数据" />
                    <Tab label="提交记录" />
                </Tabs>
                <AdminTabPanel index={0} selectedIndex={value}>
                    {target === 'organizations' &&
                        <Box>
                            <Box sx={{ width:'100%', mb:'0.5rem', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                                <AddOrganizationsButton 
                                    refresh={refresh}
                                />
                            </Box>
                            <OrganizationsTable
                                organizations={entities}
                                refresh={refresh}
                            />
                        </Box>
                    }
                    {
                        target === 'authors' &&
                        <Box>
                            <Box sx={{ width:'100%', mb:'0.5rem', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                                <AddAuthorsButton 
                                    refresh={refresh}
                                />
                            </Box>
                            <AuthorsTable
                                authors={entities}
                                refresh={refresh}
                            />
                        </Box>
                    }
                    {
                        target === 'clips' &&
                        <Box>
                            {/* <Box sx={{ width:'100%', mb:'0.5rem', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                                <AddAuthorsButton 
                                    refresh={refresh}
                                />
                            </Box> */}
                            <ClipsTable
                                clips={entities}
                                refresh={refresh}
                            />
                        </Box>
                    }
                </AdminTabPanel>
                <AdminTabPanel index={1} selectedIndex={value}>
                    <Box>
                        {target === 'organizations' &&
                            <OrganizationsRecordsTable
                                records={records}
                                refresh={refresh}
                            />
                        }
                        {target === 'authors' &&
                            <AuthorsRecordsTable
                                records={records}
                                refresh={refresh}
                            />
                        }
                    </Box>
                </AdminTabPanel>
            </Box>
        </Box>
    );
} 