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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ChooseKeySize from "@/components/symmetric/chooseKeySize";
import Tooltip from '@mui/material/Tooltip';

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
    const [algorithm, setAlgorithm] = useState("AES");
    const [showVerified, setShowVerified] = useState(true);
    const [keySize, setKeySize] = useState(null);

    const [listItems, setListItems] = useState([128, 192, 256]);

    const handleAlgorithmChange = (event) => {
        const value = event.target.value;
        setAlgorithm(value);
        if (value == "AES" || value == "DES" || value == "Blowfish") {
            setShowVerified(true);
        } else {
            setShowVerified(false);
        }
        switch (value) {
            case "DES":
                setListItems([56]);
                break;
            case "Serpent":
                setListItems([128, 192, 256]);
                break;
            case "AES":
                setListItems([128, 192, 256]);
                break;
            case "Twofish":
                setListItems([128, 192, 256]);
                break;
        }
    };

    const handleSwitch = () => {
        setShowInputText(!showInputText);
    };

    const handleCallBack = (keySize) => {
        setKeySize(keySize);
    }

    return (
        <Grid sx={{ justifyContent: 'center', textAlign: "center", mx: 'auto' }}
            container spacing={2}>
            <Grid item xs={12}>
                <div style={{ fontSize: '20px' }}>{showInputText ? "Nhập dữ liệu cần mã hóa:" : "Tải lên file cần mã hóa:"}</div>
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
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Nhập key (định dạng base64):</div></Divider>
            </Grid>
            <Grid item lg={3} xs={12}>
                <div>Chọn kích thước key</div>
                <ChooseKeySize algorithm={algorithm} listItems={listItems} parentCallback={handleCallBack} />
            </Grid>
            <Grid item lg={9} xs={12}>
                <Form.Control as="textarea" onChange={(e) => console.log(e.target.value)}
                    rows={3} style={{ width: "80%", height: "70%", fontSize: "15px" }} />
            </Grid>

            <Grid item xs={12}>
                <Divider style={{ marginTop: "30px" }}> <div style={{ fontSize: '20px' }}>Kết quả (định dạng base64):</div></Divider>
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
        </Grid >
    )
}

export default Encrypt
