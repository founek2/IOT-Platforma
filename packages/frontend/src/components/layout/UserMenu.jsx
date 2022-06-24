import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'src/hooks';
import { getUser } from 'src/utils/getters';
import { userActions } from '../../store/actions/application/user';

const useStyles = makeStyles((theme) => ({
    rightIcon: {
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
        },
    },
    hideOnMobile: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
}));
// const isNotMobile = document.body.clientWidth > 600;

function UserMenu() {
    const [ancholEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch()
    const classes = useStyles()
    const user = useAppSelector(getUser)

    return (
        <Fragment>
            <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant="contained"
            >
                <span className={classes.hideOnMobile}>{user.info.userName}</span>
                <AccountCircle className={classes.rightIcon} />
            </Button>
            <Menu id="menu-appbar" anchorEl={ancholEl} open={Boolean(ancholEl)} onClose={() => setAnchorEl(null)}>
                <Link to="/profile" onClick={() => setAnchorEl(null)}>
                    <MenuItem>Můj účet</MenuItem>
                </Link>

                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        dispatch(userActions.logOut())
                    }}
                >
                    Odhlásit
                </MenuItem>
            </Menu>
        </Fragment>
    );
}



export default UserMenu;
