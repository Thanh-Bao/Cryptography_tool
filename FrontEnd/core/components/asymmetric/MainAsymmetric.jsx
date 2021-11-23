import React, { useCallback, useState, useEffect } from 'react'
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChooseKeySize from "@/components/asymmetric/chooseKeySize";
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
import { useRouter } from 'next/router';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HttpsIcon from '@mui/icons-material/Https';
import ReactLoading from "react-loading";

const ZoneDownload = (props) => {
    return (
        <>
            <Stack spacing={2}>
                <FileDownloadOutlinedIcon sx={{ mx: 'auto' }} style={{ fontSize: "4em", color: '#969592' }} />
                <div>
                    <a style={{ color: "blue", textDecoration: "underline", marginRight: "10px" }}
                        target='_blank' rel="noreferrer" href={props.pathFileDownload}>{props.pathFileDownload}</a>
                    <a target='_blank' rel="noreferrer" href={props.pathFileDownload}>
                        <Button disabled={props.pathFileDownload ? false : true}
                            variant="contained">Tải file về máy</Button></a>
                </div>
            </Stack>
        </>
    )
}


const MainAsymmetric = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [algorithm, setAlgorithm] = useState("RSA");
    const [keySize, setKeySize] = useState(1024);
    const [keyValue, setKeyValue] = useState("");
    const [publicKeyValue, setPublicKeyValue] = useState("");
    const [privateKeyValue, setPrivateKeyValue] = useState("");
    const [IVValue, setIVValue] = useState("");
    const [cipherMode, setCipherMode] = useState(1);
    const [modeOperation, setModeOperation] = useState("ECB");
    const [padding, setPadding] = useState("PKCS1Padding")
    const [dataInput, setDataInput] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [pathFileDownload, setPathFileDownload] = useState(null);
    const [blockSize, setBlockSize] = useState(16); //AES
    // UI
    const [inputSize, setInputSize] = useState(0);
    const [dataOutput, setDataOutput] = useState("");
    const [showInputText, setShowInputText] = React.useState(true);
    const [showVerified, setShowVerified] = useState(true);
    const [listItems, setListItems] = useState([128, 192, 256]);
    const [showCopyKey, setShowCopyKey] = useState(false);
    const [showCopyIV, setShowCopyIV] = useState(false);
    const [disabledGenKey, setDisabledGenKey] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [uploadFileWarning, setUploadFileWarning] = useState(false);
    const [showUploadLoading, setShowUploadLoading] = useState(false);

    const LOADING = "Đang lấy dữ liệu, vui lòng chờ hoặc kiểm tra lại internet!....";

    const handleAlgorithmChange = (event) => {
        const value = event.target.value;
        setAlgorithm(value);
        if (value == "RSA") {
            setShowVerified(true);
        } else {
            setShowVerified(false);
        }
    };

    const handleSwitch = () => {
        setShowInputText(!showInputText);
    };

    const handleCallBack = (data) => {
        setDisabledGenKey(data.disableGenKey);
        setKeySize(data.keySize);
    }

    const getKeyAPI = () => {
        setShowCopyKey(true);
        setPublicKeyValue(LOADING);
        setPrivateKeyValue(LOADING);
        const body = {
            "keySize": keySize,
            "algorithm": algorithm
        }
        axios({
            method: 'post',
            url: `${SITE_URL}/asymmetric/generateKey`,
            data: body
        }).then((res) => {
            setPublicKeyValue(res.data.publicKey);
            setPrivateKeyValue(res.data.privateKey);
        }).catch(err => {
            enqueueSnackbar("Lỗi tạo key, vui lòng chọn đúng");
        });
    }
    const getIV_API = () => {
        setShowCopyIV(true);
        setIVValue(genIV(blockSize));
    }

    const handleSubmit = () => {
        setDataOutput(LOADING)
        if (fileName == null) {
            const data = dataInput;
            const body = {
                "key": keyValue,
                "mode": cipherMode, // trong Cipher mode java 1 là mã hóa
                "algorithm": algorithm,
                "modeOperation": modeOperation,
                "padding": padding,
                "iv": IVValue,
                "data": data,
            }
            console.log("encrypt data request", body);
            axios({
                method: 'post',
                url: `${SITE_URL}/asymmetric/crypto-text`,
                data: body
            }).then((res) => {
                successCrypto(res);
            }).catch(err => {
                errorCrypto();
            });
        } else if (cipherMode == 1) {
            const body = {
                "key": keyValue,
                "data": fileName,
            }
            axios({
                method: 'post',
                url: `${SITE_URL}/asymmetric/encrypt-file`,
                data: body
            }).then((res) => {
                successCrypto(res);
            }).catch(err => {
                errorCrypto();
            });
        } else {
            const body = {
                "key": keyValue,
                "data": fileName,
            }
            axios({
                method: 'post',
                url: `${SITE_URL}/asymmetric/decrypt-file`,
                data: body
            }).then((res) => {
                successCrypto(res);
            }).catch(err => {
                errorCrypto();
            });
        }
    }

    const successCrypto = res => {
        if (fileName) {
            setPathFileDownload(SITE_URL + res.data.content);
        } else {
            setDataOutput(res.data.content);
        }
        router.push(`${window.location.pathname}#result-output`)
    }

    const errorCrypto = () => {
        enqueueSnackbar("Lỗi mã hóa, vui lòng kiểm tra lại và chọn các options");
        setDataOutput("");
    }



    const onFormSubmitFile = (e) => {
        e.preventDefault() // Stop form submit

        setShowUploadLoading(true);
        let formData = new FormData();
        formData.append("file", file)

        var config = { headers: { 'Content-Type': 'multipart/form-data' } };

        axios.post(`${SITE_URL}/uploadFile`, formData, config)
            .then((res) => {
                setShowUploadLoading(false);
                enqueueSnackbar("Tải file thành công");
                setFileName(res.data.content);
            })
            .catch((err) => {
                setShowUploadLoading(false);
                enqueueSnackbar("Lỗi tải file, vui lòng kiểm tra lại");
                console.log(err)
            });
    }

    function genIV(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    const switchCryptMode = (e, newValue) => {
        setCipherMode(newValue);
        setPathFileDownload(null);
        setFileName(null);
        setDataInput("");
        setDataOutput("");
        setFile(null);
        if (newValue == 2) {
            setKeyValue("");
        }
    }

    useEffect(() => {
        if (fileName != null) {
            setUploadFileWarning(false);
        }

        if (showInputText) {
            setUploadFileWarning(false);
            if (modeOperation == "ECB") {
                if (dataInput != "" && keyValue != "")
                    setShowSubmit(true);
                else setShowSubmit(false);
            } else {
                if (dataInput != "" && keyValue != "" && IVValue != "")
                    setShowSubmit(true);
                else setShowSubmit(false);
            }
        } else {
            if (modeOperation == "ECB") {
                if (fileName != null && keyValue != "") {
                    setShowSubmit(true);
                }
                else {
                    setShowSubmit(false);
                }
                if (fileName == null && keyValue != "") {
                    setUploadFileWarning(true);
                }
            } else {
                if (fileName != null && keyValue != "" && IVValue != "") {
                    setShowSubmit(true);
                }
                else {
                    setShowSubmit(false);
                    if (fileName == null && keyValue != "" && IVValue != "") {
                        setUploadFileWarning(true);
                    }
                }

            }
        }

    }, [keyValue, IVValue, modeOperation, showInputText, fileName, dataInput]);


    return (
        <Grid sx={{ justifyContent: 'center', textAlign: "center", mx: 'auto' }}
            container spacing={2}>
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                <ToggleButtonGroup
                    color="primary"
                    value={cipherMode}
                    exclusive
                    onChange={switchCryptMode}
                >
                    <ToggleButton value={1}><span style={{ fontWeight: 900, fontSize: "1.2em" }}>Mã Hóa</span></ToggleButton>
                    <ToggleButton value={2}><span style={{ fontWeight: 900, fontSize: "1.2em" }}>Giải Mã</span></ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Grid item xs={12}>
                <div style={{ fontSize: '20px' }}>Nhập {showInputText ? "text" : "file"} cần {cipherMode == 1 ? "mã hóa" : "giải mã"} :</div>
                <div style={{ marginTop: "5px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                    <HttpsIcon style={{ color: "#575859", verticalAlign: 'middle', fontSize: '15px' }} />
                    <span style={{ color: "#575859" }}> {showInputText ? "Plaintext" : "File"} được gửi tới server thông qua HTTPS (SSL) </span>
                </div>
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
                            onChange={event => { setDataInput(event.target.value), setInputSize(event.target.value.length), setDataOutput("") }}
                            rows={3} style={{ width: "80%", height: "110%", fontSize: "15px" }} />
                        {inputSize > 0 ? <div>{inputSize * 8} bit</div> : null}
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
                                    {showUploadLoading ?
                                        <div>
                                            <div style={{ marginLeft: "250px" }}><ReactLoading type="spokes" color="#001aff" /></div>
                                            <h1>Đang upload!</h1>
                                        </div> : null
                                    }
                                </Stack>
                            </label>
                        </div>
                    </>
                }
            </Grid>

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Chọn thuật toán mã hóa, padding:</div></Divider>
            </Grid>
            <Grid item lg={4} xs={12}>
                <div>Thuật toán</div>
                <FormControl >
                    <Select
                        value={algorithm}
                        onChange={handleAlgorithmChange}
                    >
                        <MenuItem value={"RSA"}>
                            <span style={{ fontWeight: "bolder" }}>RSA-</span> Rivest Shamir Adleman
                        </MenuItem>
                        <MenuItem disabled value={null}>
                            Đang cập nhật .....
                        </MenuItem>

                    </Select>
                </FormControl>
            </Grid>

            <Grid item lg={3} md={5} xs={12}>
                <div>Mode Operation</div>
                <br />
                <span style={{ fontWeight: "bolder" }}>ECB</span> - Electronic Codebook
            </Grid>

            <Grid item lg={3} md={5} xs={12}>
                <div>Padding</div>
                <FormControl>
                    <Select
                        value={padding}
                        onChange={event => setPadding(event.target.value)}
                    >
                        <MenuItem value={"PKCS1Padding"}>
                            <span style={{ fontWeight: "bolder" }}>PKCS1Padding</span>
                        </MenuItem>
                        <MenuItem disabled={showInputText ? false : true} value={"OAEPWithSHA-1AndMGF1Padding"}>
                            <span style={{ fontWeight: "bolder" }}>OAEPWithSHA-1AndMGF1Padding</span>
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {modeOperation == "ECB" ? null :
                <>
                    <Grid item xs={12}>
                        <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nhập initialization vector (IV)</div></Divider>
                    </Grid>
                    <Grid item lg={3} xs={4}>
                        <div>
                            <Stack direction="row"
                                sx={{ mx: "auto", justifyContent: "center", textAlign: "center", marginTop: "10px", marginLeft: "49px" }}
                                spacing={1}>
                                <Tooltip title="Mỗi ký tự ASCII có kích thước 1 byte">
                                    <Button
                                        onClick={getIV_API}
                                        variant="contained">Tạo IV ngẫu nhiên {blockSize} ký tự</Button>
                                </Tooltip>
                                <Tooltip style={{ visibility: showCopyIV ? "visible" : "hidden" }}
                                    title="Copy key">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(IVValue) }} >
                                        <ContentCopyOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </div>
                    </Grid>
                    <Grid item lg={9} xs={12}>
                        <Form.Control as="textarea"
                            value={IVValue}
                            onChange={e => { setIVValue(e.target.value); if (IVValue == "") { setShowCopyIV(false) } }}
                            rows={3} style={{ width: "80%", height: "70%", fontSize: "15px" }} />
                        <div>IV có kích thước <b>{blockSize} bytes</b> ({blockSize * 8} bits) đối với thuật toán <b>{algorithm}</b> </div>
                    </Grid>
                </>
            }

            {cipherMode == 1 ?
                <Grid item xs={11}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Grid item xs={12}>
                                <span style={{ fontSize: "1.5em", color: "blue", fontWeight: "bolder" }} > Bạn chưa có key? Click để tạo key </span>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails >
                            <Stack alignItems="center"
                                justifyContent="center" direction="row" spacing={10}>
                                <Box>
                                    <div>Nhập kích thước key (bit)</div>
                                    <ChooseKeySize disabled={showInputText ? false : true} algorithm={algorithm} listItems={listItems} keySize={keySize} parentCallback={handleCallBack} />
                                    <div>
                                        <Tooltip title="Key được hệ thống tạo ngẫu nhiên từng bit">
                                            <Button disabled={disabledGenKey}
                                                onClick={getKeyAPI}
                                                variant="contained">Tạo key ngẫu nhiên</Button>
                                        </Tooltip>
                                    </div>
                                </Box>
                                <div style={{ width: "60%" }}>
                                    <span>Public key (base64)</span>
                                    <Form.Control as="textarea"
                                        value={publicKeyValue}
                                        onChange={e => { setPublicKeyValue(e.target.value); if (publicKeyValue == "") { setShowCopyKey(false) } }}
                                        rows={3} style={{ width: "100%", height: "100%", fontSize: "15px" }} />
                                    <br />
                                    <br />
                                    <br />
                                    <span>Private key (base64)</span>
                                    <Form.Control as="textarea"
                                        value={privateKeyValue}
                                        onChange={e => { setPrivateKeyValue(e.target.value); if (privateKeyValue == "") { setShowCopyKey(false) } }}
                                        rows={9} style={{ width: "100%", height: "100%", fontSize: "15px" }} />
                                </div>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                : null}

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nhập

                    {showInputText ? <>
                        {cipherMode == 1 ?
                            <span><b> public key</b> (hoặc private key)</span> : <span><b> private key</b> (hoặc public key)</span>
                        }</>
                        : " private key "
                    }

                    (base64):</div></Divider>
            </Grid>
            <Grid item lg={3} xs={4}>
                {publicKeyValue != "" && cipherMode == 1 ?
                    <Button
                        onClick={() => setKeyValue(publicKeyValue)}
                        variant="contained">Sử dụng public key bên trên</Button> : null
                }
            </Grid>
            <Grid item lg={9} xs={12}>
                <Form.Control as="textarea"
                    value={keyValue}
                    onChange={e => { setKeyValue(e.target.value); if (keyValue == "") { setShowCopyKey(false) } }}
                    rows={5} style={{ width: "80%", height: "100%", fontSize: "15px" }} />
            </Grid>


            <Grid item xs={12}>
                <Stack spacing={1}>
                    <span style={{ color: "red", fontWeight: "900" }}>
                        {uploadFileWarning ?
                            <span>Bạn chưa upload file!</span> :
                            (!showSubmit ?
                                <span>hãy nhập đủ thông tin để {cipherMode == 1 ? "mã hóa" : "giải mã"}</span> : null
                            )
                        }
                    </span>

                    <div>
                        <Button
                            disabled={!showSubmit}
                            onClick={handleSubmit}
                            size="large" sx={{ fontSize: "18px" }}
                            variant="contained" startIcon={<LockIcon />}>
                            {cipherMode == 1 ? "MÃ HÓA" : "GIẢI MÃ"}
                        </Button>
                    </div>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>
                    {showInputText ? "Kết quả (base64):" : "File đã mã hóa:"}
                </div></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <Tooltip style={{ visibility: dataOutput != "" ? "visible" : "hidden" }}
                    title="Copy kết quả">
                    <IconButton onClick={() => { navigator.clipboard.writeText(dataOutput) }} >
                        <ContentCopyOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
            {showInputText ?
                <Grid item lg={9} xs={12}>
                    <div>
                        <Form.Control as="textarea"
                            id="result-output"
                            value={dataOutput}
                            rows={3} style={{ width: "80%", height: "120px", fontSize: "15px" }} />
                    </div>
                </Grid>
                :
                <Grid item xs={12}>
                    <ZoneDownload pathFileDownload={pathFileDownload} />
                </Grid>
            }
            {cipherMode == 1 && dataOutput != "" || pathFileDownload != null ?
                <h3 style={{ color: "green" }}>Vui lòng lưu lại {IVValue != "" ? "IV," : null} key, thuật toán, mode, padding để giải mã</h3> : null
            }
        </Grid >
    )
}

export default MainAsymmetric
