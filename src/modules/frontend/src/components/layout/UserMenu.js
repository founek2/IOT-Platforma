import React, { useState, Fragment } from 'react'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUserInfo } from 'framework-ui/src/utils/getters'
import { userLogOut } from 'framework-ui/src/redux/actions/application/user'
import * as deviceActions from '../../store/actions/application/devices'

const styles = theme => ({
     rightIcon: {
          marginLeft: 0,
          [theme.breakpoints.up('sm')]: {
               marginLeft: theme.spacing(1),
          }
     },
     hideOnMobile: {
          [theme.breakpoints.down('xs')]: {
               display: "none"
          }
     }
})
// const isNotMobile = document.body.clientWidth > 600;

function UserMenu({ classes, logOutAction, userInfo, fetchDevicesAction }) {
     const [ancholEl, setAnchorEl] = useState(null)
     // const curriedSetOpen = bool => () => setOpen(bool)

     return (
          <Fragment>
               <Button
                    onClick={e => setAnchorEl(e.currentTarget)}
                    //color="inherit"
                    variant="contained"
               >
                    <span className={classes.hideOnMobile}>{userInfo.userName}</span>
                    <AccountCircle className={classes.rightIcon} />
               </Button>
               <Menu
                    id="menu-appbar"
                    anchorEl={ancholEl}
                    open={Boolean(ancholEl)}
                    onClose={() => setAnchorEl(null)}
               >
                    <MenuItem>Můj účet</MenuItem>
                    <MenuItem
                         onClick={() => {
                              setAnchorEl(null)
                              logOutAction().then(
                                   fetchDevicesAction
                              )
                         }}
                    >
                         Odhlásit
                    </MenuItem>
               </Menu>
          </Fragment>
     )
}

const _mapStateToProps = state => ({
     userInfo: getUserInfo(state)
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               logOutAction: userLogOut,
               fetchDevicesAction: deviceActions.fetch
          },
          dispatch
     )
export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(UserMenu))
