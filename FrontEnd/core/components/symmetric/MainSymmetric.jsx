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
import { useRouter } from 'next/router';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
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
                            variant="contained">T???i file v??? m??y</Button></a>
                </div>
                {props.showDownloadLoading ?
                    <Box sx={{ justifyContent: "center", textAlign: "center", flex: "center" }}>
                        <div style={{ marginLeft: "48%" }} >
                            <ReactLoading type="spokes" color="#001aff" />
                        </div>
                    </Box> : null
                }
            </Stack>
        </>
    )
}


const MainSymmetric = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [algorithm, setAlgorithm] = useState("AES");
    const [keySize, setKeySize] = useState(128);
    const [keyValue, setKeyValue] = useState("");
    const [IVValue, setIVValue] = useState("");
    const [cipherMode, setCipherMode] = useState(1);
    const [modeOperation, setModeOperation] = useState("ECB");
    const [padding, setPadding] = useState("PKCS5Padding")
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
    const [show3rd, setShow3rd] = useState(false);
    const [disabledGenKey, setDisabledGenKey] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [uploadFileWarning, setUploadFileWarning] = useState(false);
    const [showUploadLoading, setShowUploadLoading] = useState(false);
    const [showDownloadLoading, setShowDownloadLoading] = useState(false);

    const LOADING = "??ang l???y d??? li???u, vui l??ng ch??? ho???c ki???m tra l???i internet!....";

    const handleAlgorithmChange = (event) => {
        const value = event.target.value;
        setAlgorithm(value);
        setKeyValue("");
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
                setBlockSize(8)
                break;
            case "AES":
            case "Twofish":
            case "Serpent":
                setListItems([128, 192, 256]);
                setKeySize(128);
                setBlockSize(16)
                break;
            case "Blowfish":
                setKeySize(32);
                setBlockSize(8)
                break;
        }
    };

    const handleSwitch = () => {
        setShowInputText(!showInputText);
        setShowDownloadLoading(false);
    };

    const handleCallBack = (data) => {
        setDisabledGenKey(data.disableGenKey);
        setKeySize(data.keySize);
    }

    const getKeyAPI = () => {
        setShowCopyKey(true);
        setKeyValue(LOADING);
        const body = {
            "keySize": keySize,
            "algorithm": algorithm
        }
        axios({
            method: 'post',
            url: `${SITE_URL}/symmetric/generateKey`,
            data: body
        }).then((res) => {
            setKeyValue(res.data.content);
        }).catch(err => {
            enqueueSnackbar("L???i t???o key, vui l??ng ch???n ????ng");
        });
    }
    const getIV_API = () => {
        setShowCopyIV(true);
        setIVValue(genIV(blockSize));
    }

    const handleSubmit = () => {
        const data = fileName ? fileName : dataInput;
        setDataOutput(LOADING);
        setShowDownloadLoading(true);
        const body = {
            "key": keyValue,
            "mode": cipherMode, // trong Cipher mode java 1 l?? m?? h??a
            "algorithm": algorithm,
            "modeOperation": modeOperation,
            "padding": padding,
            "iv": IVValue,
            "data": data,
        }
        console.log("encrypt data request", body);
        axios({
            method: 'post',
            url: `${SITE_URL}/symmetric/${fileName ? "crypto-file" : "crypto-text"}`,
            data: body
        }).then((res) => {
            if (fileName) {
                setPathFileDownload(SITE_URL + res.data.content);
                setShowDownloadLoading(false);
            } else {
                setDataOutput(res.data.content);
            }
            router.push(`${window.location.pathname}#result-output`)
        }).catch(err => {
            if (padding == "NoPadding") {
                enqueueSnackbar("L???i m?? h??a, NoPadding input lenght ph???i l?? b???i c???a 16 bytes");
            } else {
                enqueueSnackbar("L???i m?? h??a, vui l??ng ki???m tra l???i v?? ch???n c??c options");
            }
            setDataOutput("");
        });
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
                enqueueSnackbar("T???i file th??nh c??ng");
                setFileName(res.data.content);
            })
            .catch((err) => {
                setShowUploadLoading(false);
                enqueueSnackbar("L???i t???i file, vui l??ng ki???m tra l???i");
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
        setShowDownloadLoading(false);
        setPathFileDownload(null);
        setFileName(null);
        setDataInput("");
        setDataOutput("");
        setFile(null);
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
                    <ToggleButton value={1}><span style={{ fontWeight: 900, fontSize: "1.2em" }}>M?? H??a</span></ToggleButton>
                    <ToggleButton value={2}><span style={{ fontWeight: 900, fontSize: "1.2em" }}>Gi???i M??</span></ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Grid item xs={12}>
                <div style={{ fontSize: '20px' }}>Nh???p {showInputText ? "text" : "file"} c???n {cipherMode == 1 ? "m?? h??a" : "gi???i m??"} :</div>
                <div style={{ marginTop: "5px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                    <HttpsIcon style={{ color: "#575859", verticalAlign: 'middle', fontSize: '15px' }} />
                    <span style={{ color: "#575859" }}> {showInputText ? "Plaintext" : "File"} ???????c g???i t???i server th??ng qua HTTPS (SSL) </span>
                </div>
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
                                            <Button type="submit" variant="contained" >  T???i file l??n</Button>
                                        </form>
                                    </div>
                                    {showUploadLoading ?
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
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Ch???n thu???t to??n m?? h??a, mode & padding:</div></Divider>
            </Grid>
            <Grid item lg={4} xs={12}>
                <div>Thu???t to??n</div>
                <FormControl >
                    <Select
                        value={algorithm}
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
                            <span style={{ color: "#575859" }}>Thu???t to??n n??y thu???c JDK (SUN)</span>
                        </div> : null
                    }
                    {show3rd ?
                        <div style={{ marginTop: "5px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                            <InfoOutlinedIcon style={{ color: "blue", verticalAlign: 'middle' }} />
                            <span style={{ color: "#575859" }}> S??? d???ng th?? vi???n <a
                                target='_blank' rel="noreferrer"
                                style={{ color: "blue", textDecoration: "underline", fontWeight: "900" }}
                                href="https://mvnrepository.com/artifact/org.bouncycastle/bcprov-jdk15on/1.69">Bouncy Castle 1.69</a> </span>
                        </div> : null
                    }
                </FormControl>
            </Grid>

            <Grid item lg={3} md={5} xs={12}>
                <div>Mode Operation</div>
                <FormControl >
                    <Select
                        value={modeOperation}
                        onChange={event => setModeOperation(event.target.value)}
                    >
                        <MenuItem value={"ECB"}>
                            <span style={{ fontWeight: "bolder" }}>ECB</span> - Electronic Codebook
                        </MenuItem>
                        <MenuItem value={"CBC"}>
                            <span style={{ fontWeight: "bolder" }}>CBC</span> - Cipher-Block Chaining
                        </MenuItem>
                        <MenuItem value={"PCBC"}>
                            <span style={{ fontWeight: "bolder" }}>PCBC</span> - Propagating cipher-block chaining
                        </MenuItem>
                        <MenuItem value={"CFB"}>
                            <span style={{ fontWeight: "bolder" }}>CFB</span> - Cipher Feedback
                        </MenuItem>
                        <MenuItem value={"OFB"}>
                            <span style={{ fontWeight: "bolder" }}>OFB</span> - Output Feedback
                        </MenuItem>
                        <MenuItem value={"CTR"}>
                            <span style={{ fontWeight: "bolder" }}>CTR</span> - Counter
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item lg={3} md={5} xs={12}>
                <div>Padding</div>
                <FormControl>
                    <Select
                        value={padding}
                        onChange={event => setPadding(event.target.value)}
                    >
                        <MenuItem value={"PKCS5Padding"}>
                            <span style={{ fontWeight: "bolder" }}>PKCS5Padding</span>
                        </MenuItem>
                        <MenuItem value={"PKCS7Padding"}>
                            <span style={{ fontWeight: "bolder" }}>PKCS7Padding</span>
                        </MenuItem>
                        <MenuItem value={"ISO10126Padding"}>
                            <span style={{ fontWeight: "bolder" }}>ISO10126Padding</span>
                        </MenuItem>
                        <MenuItem value={"NoPadding"}>
                            <span style={{ fontWeight: "bolder" }}>NoPadding</span>
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {modeOperation == "ECB" ? null :
                <>
                    <Grid item xs={12}>
                        <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nh???p initialization vector (IV)</div></Divider>
                    </Grid>
                    <Grid item lg={3} xs={4}>
                        <div>
                            <Stack direction="row"
                                sx={{ mx: "auto", justifyContent: "center", textAlign: "center", marginTop: "10px", marginLeft: "49px" }}
                                spacing={1}>
                                <Tooltip title="M???i k?? t??? ASCII c?? k??ch th?????c 1 byte">
                                    <Button
                                        onClick={getIV_API}
                                        variant="contained">T???o IV ng???u nhi??n {blockSize} k?? t???</Button>
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
                        <div>IV c?? k??ch th?????c <b>{blockSize} bytes</b> ({blockSize * 8} bits) ?????i v???i thu???t to??n <b>{algorithm}</b> </div>
                    </Grid>
                </>
            }

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nh???p key (base64):</div></Divider>
            </Grid>
            <Grid item lg={3} xs={4}>
                <div>Ch???n k??ch th?????c key</div>
                <ChooseKeySize algorithm={algorithm} listItems={listItems} keySize={keySize} parentCallback={handleCallBack} />
                <div>
                    <Stack direction="row"
                        sx={{ mx: "auto", justifyContent: "center", textAlign: "center", marginTop: "10px", marginLeft: "49px" }}
                        spacing={1}>
                        <Tooltip title="Key ???????c h??? th???ng t???o ng???u nhi??n t???ng bit">
                            <Button disabled={disabledGenKey}
                                onClick={getKeyAPI}
                                variant="contained">T???o key ng???u nhi??n</Button>
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
                    <span style={{ color: "red", fontWeight: "900" }}>
                        {uploadFileWarning ?
                            <span>B???n ch??a upload file!</span> :
                            (!showSubmit ?
                                <span>h??y nh???p ????? th??ng tin ????? {cipherMode == 1 ? "m?? h??a" : "gi???i m??"}</span> : null
                            )
                        }
                    </span>

                    <div>
                        <Button
                            disabled={!showSubmit}
                            onClick={handleSubmit}
                            size="large" sx={{ fontSize: "18px" }}
                            variant="contained" startIcon={<LockIcon />}>
                            {cipherMode == 1 ? "M?? H??A" : "GI???I M??"}
                        </Button>
                    </div>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>
                    {showInputText ? "K???t qu??? (base64):" : "File ???? m?? h??a:"}
                </div></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <Tooltip style={{ visibility: dataOutput != "" ? "visible" : "hidden" }}
                    title="Copy k???t qu???">
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
                    <ZoneDownload
                        showDownloadLoading={showDownloadLoading}
                        pathFileDownload={pathFileDownload} />
                </Grid>
            }
            {cipherMode == 1 && dataOutput != "" || pathFileDownload != null ?
                <h3 style={{ color: "green" }}>Vui l??ng l??u l???i {IVValue != "" ? "IV," : null} key, thu???t to??n, mode, padding ????? gi???i m??</h3> : null
            }
        </Grid >
    )
}

export default MainSymmetric
