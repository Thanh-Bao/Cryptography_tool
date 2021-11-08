import React, { useCallback, useState } from 'react'
import Layout from '@/layout/layout'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Form } from 'react-bootstrap';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Hash = () => {
    const [showInputText, setShowInputText] = React.useState(true);
    const [dataInput, setDataInput] = useState("");

    const handleSwitch = () => {
        setShowInputText(!showInputText);
    };

    const onFormSubmitFile = (e) => {

    }

    return (
        <Layout>
            <Grid sx={{  justifyContent: 'center', textAlign: "center", mx: 'auto' }}
                container spacing={2}>
                <Grid item xs={12}>
                    <div style={{ fontSize: '20px' }}>{showInputText ? "Nhập dữ liệu cần mã hóa:" : "Tải lên file cần mã hóa:"}</div>
                </Grid>
                <Grid item lg={3} xs={12}>
                    <FormControl >
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
                        <>
                            <Form.Control as="textarea"
                                value={dataInput}
                                onChange={event => { setDataInput(event.target.value) }}
                                rows={3} style={{ width: "80%", height: "110%", fontSize: "15px" }} />
                            
                        </>
                        :
                        <>
                            <div id="fileUploader">
                                <label id="labelUploader" >
                                    <Stack spacing={2}>
                                        <CloudUploadOutlinedIcon sx={{ mx: 'auto' }} style={{ fontSize: "4em", color: '#969592' }} />
                                        <div>
                                            <form onSubmit={onFormSubmitFile}>
                                                <input type="file" onChange={e => setFile(e.target.files[0])} />
                                                <Button type="submit" variant="contained" >  Tải file lên</Button>
                                            </form>
                                        </div>
                                    </Stack>
                                </label>
                            </div>
                        </>
                    }
                </Grid>
            </Grid>
        </Layout>
    )
}

export default Hash
