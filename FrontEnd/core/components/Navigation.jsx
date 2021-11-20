import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BrowserView, MobileView } from 'react-device-detect';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router'

const useStyles = makeStyles({
    menuItem: {
        cursor: 'pointer',
        '&:hover': {
        }
    }
});

const menuItems = [
    {
        label: "Mã hóa đối xứng",
        link: "/"
    },
    {
        label: "Mã hóa bất đối xứng",
        link: "/asymmetric"
    },
    
    {
        label: "Hash",
        link: "/hash"
    },
]

const MenuItem = (props) => {
    const router = useRouter();
    const classes = useStyles();
    return (
        <Button variant="text"
            className={classes.menuItem}
            onClick={() => router.push(props.link)}
        >
            <span style={{ color: "white", fontWeight: 900, fontSize: "17px" }}>{props.label}</span>
        </Button>
    )
}

const TemporaryDrawer = props => {
    const [state, setState] = React.useState(false);

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
        >
            <List>
                {menuItems.map(({ label, link }) => (
                    <ListItem button component="a" key={link} href={link}>
                        <ListItemText primary={label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <MenuIcon
                onClick={() => setState(true)}
            />
            <Drawer
                anchor='left'
                open={state}
                onClose={() => setState(false)}
            >
                {list('left')}
            </Drawer>
        </div>
    );
}


const NavigationBar = (props) => {
    return (
        <Box sx={{ marginBottom: "1%" }}>
            <AppBar position="static" >
                <BrowserView>
                    <Toolbar sx={{ justifyContent: "center" }}>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={2}
                            sx={{ fontWeight: '900' }}
                        >
                            {menuItems.map((item) => {
                                return <MenuItem key={item.link} link={item.link} label={item.label} />
                            })}
                        </Stack>
                    </Toolbar>
                </BrowserView>
                <MobileView>
                    <Toolbar  >
                        <TemporaryDrawer />
                    </Toolbar>
                </MobileView>
            </AppBar>
        </Box>
    );
}

export default NavigationBar;
