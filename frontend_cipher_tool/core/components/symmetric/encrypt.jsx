import React, { useCallback, useState } from 'react'
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const MyDropzone = () => {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        console.log(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                <div id="fileUploader">
                    <label id="labelUploader" >
                        <Stack spacing={2}>
                            <CloudUploadOutlinedIcon sx={{ mx: 'auto' }} style={{ fontSize: "4em", color: '#969592' }} />
                            <div>
                                <Button variant="contained">Tải file lên</Button>
                            </div>
                        </Stack>
                    </label>
                </div>
            }
        </div>
    )
}

const ZoneDownload = () => {
    return (
        <>
            <Stack spacing={2}>
                <FileDownloadOutlinedIcon sx={{ mx: 'auto' }} style={{ fontSize: "4em", color: '#969592' }} />
                <div>
                    <Button variant="contained">Tải file về máy</Button>
                </div>
            </Stack>
        </>
    )
}

const Encrypt = () => {
    const [showInputText, setShowInputText] = React.useState(true);

    const handleSwitch = () => {
        setShowInputText(!showInputText);
    };
    return (
        <Grid sx={{ justifyContent: 'center', textAlign: "center", mx: 'auto' }}
            container spacing={2}>
            <Grid item xs={12}>
                <h2>Nhập dữ liệu cần mã hóa:</h2>
            </Grid>
            <Grid item lg={3} xs={12}>
                <FormControl  >
                    <FormLabel >Bạn cần mã hóa gì?</FormLabel>
                    <RadioGroup
                        value={showInputText}
                        onChange={handleSwitch}
                    >
                        <FormControlLabel value={true} control={<Radio />} label="Chuỗi, văn bản, text, ..." />
                        <FormControlLabel value={false} control={<Radio />} label="File" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item lg={9} xs={12}>
                {showInputText ?
                    <Form.Control as="textarea"
                        rows={3} style={{ width: "80%", height: "110%", fontSize: "15px" }} />
                    : <MyDropzone />
                }
            </Grid>


            <Grid item xs={12}>
                <Divider> <h2>Nhập key:</h2></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <h1>xs=6 md=8</h1>
            </Grid>
            <Grid item lg={9} xs={12}>
                <h1>xs=6 md=8</h1>
            </Grid>

            <Grid item xs={12}>
                <Divider> <h2>Kết quả:</h2></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <h1>xs=6 md=8</h1>
            </Grid>
            <Grid item lg={9} xs={12}>
                {showInputText ?
                    <div>
                        <Form.Control as="textarea"
                            rows={3} style={{ width: "80%", height: "120px", fontSize: "15px" }} />
                    </div>
                    : <ZoneDownload />
                }
            </Grid>
        </Grid>
    )
}

export default Encrypt
