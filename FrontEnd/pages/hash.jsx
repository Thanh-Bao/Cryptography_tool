import React, { useCallback, useState, useEffect } from 'react'
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
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { SITE_URL } from '../core/config';
import TextField from '@mui/material/TextField';
import ReactLoading from "react-loading";

const Hash = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [showInputText, setShowInputText] = React.useState(true);
    const [dataInput, setDataInput] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [dataOutput, setDataOuput] = useState("null");
    const [algorithm, setAlgorithm] = useState("MD5");
    const [hashMatch, setHashMatch] = useState("");
    const [INHOA, setINHOA] = useState(false);

    //UI
    const [showUpload, setShowUpload] = useState(false);


    const handleSwitch = () => {
        setShowInputText(!showInputText);
        setDataInput("");
        setDataOuput("");
    };

    const onFormSubmitFile = (e) => {
        setShowUpload(true);
        setDataOuput("null");
        e.preventDefault() // Stop form submit

        let formData = new FormData();
        formData.append("file", file)

        var config = { headers: { 'Content-Type': 'multipart/form-data' } };

        axios.post(`${SITE_URL}/uploadFile`, formData, config)
            .then((res) => {
                enqueueSnackbar("T???i file th??nh c??ng");
                setFileName(res.data.content);
            })
            .catch((err) => {
                enqueueSnackbar("L???i t???i file, vui l??ng ki???m tra l???i");
                console.log(err)
            });
    }

    useEffect(() => {
        const body = {
            "algorithm": algorithm,
            "data": fileName
        }
        if (fileName != null) {
            axios({
                method: 'post',
                url: `${SITE_URL}/hash-file`,
                data: body
            }).then((res) => {
                setShowUpload(false);
                setDataOuput(res.data);
            }).catch(err => {
                setShowUpload(false);
                enqueueSnackbar("L???i hash file");
            });
        }
    }, [fileName]);

    // send data to backend
    useEffect(() => {
        const body = {
            "algorithm": algorithm,
            "data": dataInput
        }
        if (dataInput.length > 0) {
            setDataOuput("loading...");
            axios({
                method: 'post',
                url: `${SITE_URL}/hash-text`,
                data: body
            }).then((res) => {
                setDataOuput(res.data.content);
            }).catch(err => {
                enqueueSnackbar("l???i, vui l??ng ki???m tra l???i");
                setDataOuput("L???i t???o hash")
            });
        } else {
            setDataOuput("null")
        }
    }, [dataInput, algorithm]);



    return (
        <Layout>
            <Grid sx={{ justifyContent: 'center', textAlign: "center", mx: 'auto', marginTop: "40px" }}
                container >
                <Grid item xs={12}>
                    <div style={{ fontSize: '20px' }}>{showInputText ? "Nh???p d??? li???u c???n m?? h??a:" : "T???i l??n file c???n m?? h??a:"}</div>
                </Grid>
                <Grid item lg={3} xs={12}>
                    <FormControl >
                        <FormLabel >B???n c???n m?? h??a g???</FormLabel>
                        <RadioGroup
                            value={showInputText}
                            onChange={handleSwitch}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Chu???i, v??n b???n, text, ..." />
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
                                                <Button type="submit" variant="contained" >  T???i file l??n</Button>
                                            </form>
                                        </div>
                                        {showUpload ?
                                            <div>
                                                <div style={{ marginLeft: "250px" }}><ReactLoading type="spokes" color="#001aff" /></div>
                                                <h1>??ang upload!</h1>
                                            </div> : null
                                        }
                                    </Stack>
                                </label>
                            </div>
                        </>
                    }
                </Grid>

                <Grid item xs={12}>
                    <Divider style={{ marginTop: "30px", marginBottom: "30px" }}> <div style={{ fontSize: '20px' }}>
                        Ch???n thu???t to??n hash
                    </div></Divider>
                </Grid>

                <Grid item lg={2} xs={12}>
                    <FormControl >
                        <Select
                            value={algorithm}
                            onChange={event => setAlgorithm(event.target.value)}
                        >
                            <MenuItem value={"MD5"}>
                                <span style={{ fontWeight: "bolder" }}>MD5</span>
                            </MenuItem>
                            <MenuItem value={"SHA-1"}>
                                <span style={{ fontWeight: "bolder" }}>SHA-1</span>
                            </MenuItem>
                            <MenuItem value={"SHA-256"}>
                                <span style={{ fontWeight: "bolder" }}>SHA-256</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Divider style={{ marginTop: "30px", marginBottom: "30px" }}> <div style={{ fontSize: '20px' }}>
                        K???t qu???:
                    </div></Divider>
                </Grid>

                <Grid item lg={2} xs={12}>
                    <div style={{ marginBottom: "3%" }}>
                        <Checkbox onChange={e => setINHOA(e.target.checked)} />In hoa
                    </div>
                    <div>
                        <IconButton onClick={() => { navigator.clipboard.writeText(dataOutput) }} >
                            <ContentCopyOutlinedIcon />
                        </IconButton> Copy
                    </div>
                </Grid>
                <Grid item lg={10} xs={12}>
                    <Box sx={{ fontWeight: "900", fontSize: "1.5em", textTransform: `${INHOA ? "uppercase" : "lowercase"}` }}>
                        {dataOutput}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Divider style={{ marginTop: "30px", marginBottom: "30px" }}> <div style={{ fontSize: '20px' }}>
                        So kh???p v???i hash cho tr?????c:
                    </div></Divider>
                </Grid>

                <Grid item lg={3}>
                </Grid>
                <Grid item lg={9} xs={12}>
                    <Box>
                        <TextField
                            onChange={e => setHashMatch(e.target.value)}
                            style={{ width: "80%" }}
                            label="Nh???p hash c???n ki???m tra" variant="outlined" />
                    </Box>
                    {hashMatch.length > 0 ?
                        <h2 style={{ fontWeight: "900" }}>{dataOutput.toLocaleLowerCase() == hashMatch.toLocaleLowerCase() ?
                            <span style={{ color: "green" }}>match</span> :
                            <span style={{ color: "red" }}>kh??ng match</span>}
                        </h2>
                        : null}

                </Grid>

            </Grid>
            <br />
        </Layout>
    )
}

export default Hash
