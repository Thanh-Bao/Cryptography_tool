import React, { useCallback, useState } from 'react'
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { Form } from 'react-bootstrap';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChooseKeySize from "@/components/symmetric/chooseKeySize";
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import IconButton from '@mui/material/IconButton';
import { SITE_URL } from '../../config';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LockIcon from '@mui/icons-material/Lock';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles';


const ZoneDownload = (props) => {
    return (
        <>
            <Stack spacing={2}>
                <FileDownloadOutlinedIcon sx={{ mx: 'auto' }} style={{ fontSize: "4em", color: '#969592' }} />
                <div>
                    <Button disabled={props.fileName ? false : true} variant="contained">Tải file về máy</Button>
                </div>
            </Stack>
        </>
    )
}


const Encrypt = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [algorithm, setAlgorithm] = useState("AES");
    const [keySize, setKeySize] = useState(128);
    const [keyValue, setKeyValue] = useState("");
    const [dataInput, setDataInput] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    // UI
    const [dataOutput, setDataOutput] = useState("");
    const [showInputText, setShowInputText] = React.useState(true);
    const [showVerified, setShowVerified] = useState(true);
    const [listItems, setListItems] = useState([128, 192, 256]);
    const [showCopyKey, setShowCopyKey] = useState(false);
    const [show3rd, setShow3rd] = useState(false);

    const handleAlgorithmChange = (event) => {
        const value = event.target.value;
        setAlgorithm(value);
        if (value == "AES" || value == "DES" || value == "Blowfish") {
            setShowVerified(true);
            setShow3rd(false);
        } else {
            setShow3rd(true);
            setShowVerified(false);
        }
        switch (value) {
            case "DES":
                setListItems([56]);
                setKeySize(56);
                break;
            case "Serpent":
            case "AES":
            case "Twofish":
            case "Serpent":
                setListItems([128, 192, 256]);
                setKeySize(128);
                break;
            case "Blowfish":
                setKeySize(32);
                break;
        }
    };

    const handleSwitch = () => {
        setShowInputText(!showInputText);
    };

    const handleCallBack = (keySize) => {
        setKeySize(keySize);
    }

    const getKeyAPI = () => {
        setShowCopyKey(true);
        axios({
            method: 'post',
            url: `${SITE_URL}/symmetric/generateKey`,
            data: {
                "keySize": keySize,
                "algorithm": algorithm
            }
        }).then((res) => {
            setKeyValue(res.data.content);
        }).catch(err => {
            enqueueSnackbar("Lỗi tạo key, vui lòng chọn đúng");
        });
    }

    const handleSubmit = () => {
        axios({
            method: 'post',
            url: `${SITE_URL}/symmetric/crypto-text`,
            data: {
                "key": keyValue,
                "data": dataInput,
                "mode": 1, // trong Cipher mode java 1 là mã hóa
                "algorithm": algorithm
            }
        }).then((res) => {
            setDataOutput(res.data.content);
            router.push(`${window.location.pathname}#result-output`)
        }).catch(err => {
            enqueueSnackbar("Lỗi mã hóa, vui lòng nhập đúng");
        });
    }

    const onFormSubmitFile = (e) => {
        e.preventDefault() // Stop form submit

        let formData = new FormData();
        formData.append("file", file)

        var config = { headers: { 'Content-Type': 'multipart/form-data' } };

        axios.post(`${SITE_URL}/uploadFile`, formData, config)
            .then((res) => {
                enqueueSnackbar("Tải ảnh thành công");
                setFileName(res.data.content);
            })
            .catch(() => enqueueSnackbar("Lỗi tải file, vui lòng kiểm tra lại"));
    }

    return (
        <Grid sx={{ justifyContent: 'center', textAlign: "center", mx: 'auto' }}
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
                    <Form.Control as="textarea"
                        value={dataInput}
                        onChange={event => setDataInput(event.target.value)}
                        rows={3} style={{ width: "80%", height: "110%", fontSize: "15px" }} />
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

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Chọn thuật toán mã hóa:</div></Divider>
            </Grid>
            <Grid item xs={12}>
                <FormControl sx={{ width: "30%" }}>
                    <InputLabel>thuật toán*</InputLabel>
                    <Select
                        value={algorithm}
                        label="click để chọn"
                        onChange={handleAlgorithmChange}
                    >
                        <MenuItem value={"AES"}>
                            <span style={{ fontWeight: "bolder" }}>AES-</span> Advanced Encryption Standard
                        </MenuItem>
                        <MenuItem value={"DES"}>
                            <span style={{ fontWeight: "bolder" }}>DES-</span> Data Encryption Standard
                        </MenuItem>
                        <MenuItem value={"Blowfish"}>
                            <span style={{ fontWeight: "bolder" }}>Blowfish</span>
                        </MenuItem>
                        <MenuItem value={"Twofish"}>
                            <span style={{ fontWeight: "bolder" }}>Twofish</span>
                        </MenuItem>
                        <MenuItem value={"Serpent"}>
                            <span style={{ fontWeight: "bolder" }}>Serpent</span>
                        </MenuItem>
                    </Select>
                    {showVerified ?
                        <div style={{ marginTop: "5px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                            <VerifiedUserIcon style={{ color: "green", verticalAlign: 'middle' }} />
                            <span style={{ color: "#575859" }}>Thuật toán này được java hỗ trợ</span>
                        </div> : null
                    }
                    {show3rd ?
                        <div style={{ marginTop: "5px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                            <InfoOutlinedIcon style={{ color: "blue", verticalAlign: 'middle' }} />
                            <span style={{ color: "#575859" }}> Thuật toán này dùng thư viện ngoài JDK</span>
                        </div> : null
                    }
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nhập key (định dạng base64):</div></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <div>Chọn kích thước key</div>
                <ChooseKeySize algorithm={algorithm} listItems={listItems} parentCallback={handleCallBack} />
                <div>
                    <Stack direction="row"
                        sx={{ mx: "auto", justifyContent: "center", textAlign: "center", marginTop: "10px", marginLeft: "49px" }}
                        spacing={1}>
                        <Tooltip title="Key được hệ thống tạo ngẫu nhiên từng bit">
                            <Button onClick={getKeyAPI} variant="contained">Tạo key ngẫu nhiên</Button>
                        </Tooltip>
                        <Tooltip style={{ visibility: showCopyKey ? "visible" : "hidden" }}
                            title="Copy key">
                            <IconButton onClick={() => { navigator.clipboard.writeText(keyValue) }} >
                                <ContentCopyOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </div>


            </Grid>
            <Grid item lg={9} xs={12}>
                <Form.Control as="textarea"
                    value={keyValue}
                    onChange={e => { setKeyValue(e.target.value); if (keyValue == "") { setShowCopyKey(false) } }}
                    rows={3} style={{ width: "80%", height: "70%", fontSize: "15px" }} />
            </Grid>

            <Grid item xs={12}>
                <Stack spacing={1}>
                    {(dataInput == "" || keyValue == "") ?
                        <span>hãy nhập đủ thông tin để mã hóa</span> : null
                    }
                    <div>
                        <Button
                            disabled={(dataInput == "" || keyValue == "") ? true : false}
                            onClick={handleSubmit}
                            size="large" sx={{ fontSize: "18px" }}
                            variant="contained" startIcon={<LockIcon />}>
                            Mã hóa
                        </Button>
                    </div>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Kết quả (định dạng base64):</div></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <Tooltip style={{ visibility: dataOutput != "" ? "visible" : "hidden" }}
                    title="Copy key">
                    <IconButton onClick={() => { navigator.clipboard.writeText(dataOutput) }} >
                        <ContentCopyOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item lg={9} xs={12}>
                {showInputText ?
                    <div>
                        <Form.Control as="textarea"
                            id="result-output"
                            value={dataOutput}
                            rows={3} style={{ width: "80%", height: "120px", fontSize: "15px" }} />
                    </div>
                    : <ZoneDownload fileName={fileName} />
                }
            </Grid>
        </Grid >
    )
}

export default Encrypt
