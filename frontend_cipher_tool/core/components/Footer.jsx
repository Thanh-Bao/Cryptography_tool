import React from 'react'
import Stack from '@mui/material/Stack';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: 'black', paddingTop: "20px", paddingBottom: "20px" }}>
            <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "center", mx: "auto" }}
                color="white"
            >
                <FacebookIcon style={{ cursor: "pointer" }} />
                <YouTubeIcon style={{ cursor: "pointer" }} />
                <GitHubIcon style={{ cursor: "pointer" }} />
            </Stack>
            <Typography sx={{ marginTop: "10px" }} align="center" variant="string" component="div" color="white" >
                Báo cáo giữa kỳ Trần Thanh Bảo 18130017 NLU - An toàn bảo mật hệ thống thông tin
            </Typography>
        </Box>
    )
}

export default Footer
