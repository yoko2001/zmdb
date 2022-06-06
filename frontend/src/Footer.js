import { Box, Link } from '@mui/material';

export const Footer = () => {
    return (
        <Box sx = {{ display:'flex', width:'100%', justifyContent:'center', pb:'1rem', color:'rgba(0,0,0,.4)', fontSize:'0.8rem'}}>
            <Box>
                Copyright © 2022 sixiwanzi.live
            </Box>
            <Box>
                备案号:<Link color='rgba(0,0,0,.4)' href='https://beian.miit.gov.cn' target='_blank' underline='none' rel="noreferrer">京ICP证030173号</Link>
            </Box>
        </Box>
    );
}