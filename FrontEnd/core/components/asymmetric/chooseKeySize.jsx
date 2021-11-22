import React, { useCallback, useState } from 'react'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import NumericInput from 'material-ui-numeric-input';


const ChooseKeySize = props => {
    const [showError, setShowError] = useState(false);

    const handleChange = (event) => {
        const value = parseInt(event.target.value);
        if (value >= 512 && value <= 4096 && value % 8 == 0) {
            props.parentCallback({ "keySize": value, "disableGenKey": false });
            setShowError(false);
        } else {
            props.parentCallback({ "keySize": value, "disableGenKey": true });
            setShowError(true);
        }
    }

    return (
        <>
            {props.algorithm != "RSA" ?
                <FormControl sx={{ marginTop: "15px" }}>
                    <Select
                        value={props.keySize}
                        onChange={event => { props.parentCallback({ "keySize": event.target.value }) }}
                    >
                        {props.listItems.map((item) => {
                            return (
                                <MenuItem key={item} value={item}>
                                    {item} bit
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl> :
                <>
                    <Stack style={{ marginTop: "10px" }} spacing={2}>
                        <div>
                            <NumericInput
                                disabled={props.disabled}
                                precision={0}
                                decimalChar=','
                                thousandChar=' '
                                error={showError}
                                onChange={handleChange}
                                defaultValue={1024}
                                helperText="key size từ 512->4096 bit & là bội của 8"
                                variant="outlined" />
                        </div>
                    </Stack>
                </>
            }
        </>
    )
}

export default ChooseKeySize
