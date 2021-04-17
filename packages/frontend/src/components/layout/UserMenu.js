import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { userLogOut } from 'framework-ui/lib/redux/actions/application/user';
import { getUser } from 'framework-ui/lib/utils/getters';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as deviceActions from '../../store/actions/application/devices';

const styles = (theme) => ({
    rightIcon: {
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1)
        }
    },
    hideOnMobile: {
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    }
});
// const isNotMobile = document.body.clientWidth > 600;

function UserMenu({ classes, logOutAction, user }) {
    const [ ancholEl, setAnchorEl ] = useState(null);
    // const curriedSetOpen = bool => () => setOpen(bool)

    return (
        <Fragment>
            <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                //color="inherit"
                variant="contained"
            >
                <span className={classes.hideOnMobile}>{user.info.userName}</span>
                <AccountCircle className={classes.rightIcon} />
            </Button>
            <Menu id="menu-appbar" anchorEl={ancholEl} open={Boolean(ancholEl)} onClose={() => setAnchorEl(null)}>
                <Link
                    to={{
                        hash: '#editUser',
                        search: `?id=${user.id}`
                    }}
                >
                    {' '}
                    <MenuItem>Můj účet</MenuItem>
                </Link>

                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        logOutAction();
                    }}
                >
                    Odhlásit
                </MenuItem>
            </Menu>
        </Fragment>
    );
}

const _mapStateToProps = (state) => ({
    user: getUser(state)
});

const _mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            logOutAction: userLogOut
        },
        dispatch
    );
export default connect(_mapStateToProps, _mapDispatchToProps)(withStyles(styles)(UserMenu));
