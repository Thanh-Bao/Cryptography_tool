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
    };

    const handleCallBack = (data) => {
        setDisabledGenKey(data.disableGenKey);
        setKeySize(data.keySize);
    }

    const getKeyAPI = () => {
        setShowCopyKey(true);
        const body = {
            "keySize": keySize,
            "algorithm": algorithm
        }
        console.log("get Key request: ", body);
        axios({
            method: 'post',
            url: `${SITE_URL}/symmetric/generateKey`,
            data: body
        }).then((res) => {
            setKeyValue(res.data.content);
        }).catch(err => {
            enqueueSnackbar("Lỗi tạo key, vui lòng chọn đúng");
        });
    }
    const getIV_API = () => {
        setShowCopyIV(true);
        setIVValue(genIV(blockSize));
    }

    const handleSubmit = () => {
        const data = fileName ? fileName : dataInput;
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
            url: `${SITE_URL}/symmetric/${fileName ? "crypto-file" : "crypto-text"}`,
            data: body
        }).then((res) => {
            if (fileName) {
                setPathFileDownload(SITE_URL + res.data.content);
            } else {
                setDataOutput(res.data.content);
            }
            router.push(`${window.location.pathname}#result-output`)
        }).catch(err => {
            enqueueSnackbar("Lỗi mã hóa, vui lòng kiểm tra lại và chọn các options");
        });
    }

    const onFormSubmitFile = (e) => {
        e.preventDefault() // Stop form submit

        let formData = new FormData();
        formData.append("file", file)

        var config = { headers: { 'Content-Type': 'multipart/form-data' } };

        axios.post(`${SITE_URL}/uploadFile`, formData, config)
            .then((res) => {
                enqueueSnackbar("Tải file thành công");
                setFileName(res.data.content);
            })
            .catch((err) => {
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
                            onChange={event => { setDataInput(event.target.value), setInputSize(event.target.value.length) }}
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
                                </Stack>
                            </label>
                        </div>
                    </>
                }
            </Grid>

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Chọn thuật toán mã hóa, mode & padding:</div></Divider>
            </Grid>
            <Grid item lg={4} xs={12}>
                <div>Thuật toán</div>
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
                            <span style={{ color: "#575859" }}>Thuật toán này thuộc JDK (SUN)</span>
                        </div> : null
                    }
                    {show3rd ?
                        <div style={{ marginTop: "5px", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                            <InfoOutlinedIcon style={{ color: "blue", verticalAlign: 'middle' }} />
                            <span style={{ color: "#575859" }}> Sử dụng thư viện <a
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

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nhập key (định dạng base64):</div></Divider>
            </Grid>
            <Grid item lg={3} xs={4}>
                <div>Chọn kích thước key</div>
                <ChooseKeySize algorithm={algorithm} listItems={listItems} keySize={keySize} parentCallback={handleCallBack} />
                <div>
                    <Stack direction="row"
                        sx={{ mx: "auto", justifyContent: "center", textAlign: "center", marginTop: "10px", marginLeft: "49px" }}
                        spacing={1}>
                        <Tooltip title="Key được hệ thống tạo ngẫu nhiên từng bit">
                            <Button disabled={disabledGenKey}
                                onClick={getKeyAPI}
                                variant="contained">Tạo key ngẫu nhiên</Button>
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
                    {showInputText ? "Kết quả (định dạng base64):" : "File đã mã hóa:"}
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
            {cipherMode == 1 && dataOutput != "" || pathFileDownload!=null ?
                <h3 style={{ color: "green" }}>Vui lòng lưu lại IV, key, thuật toán, mode, padding để giải mã</h3> : null
            }
        </Grid >
    )
}

export default MainSymmetric
