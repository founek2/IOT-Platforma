import React, { useState, Fragment } from 'react'
import Menu from '@material-ui/core/Menu'
import Button from '@material-ui/core/Button'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import { o } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUserInfo } from 'framework-ui/src/utils/getters'
import { userLogOut } from 'framework-ui/src/redux/actions/application/user'

const styles =theme => ({
	rightIcon: {
		marginLeft: theme.spacing.unit,
	   },
})

let iconButton = React.createRef()

const isNotMobile = document.body.clientWidth > 600;

function UserMenu({ classes, logOutAction, userInfo }) {
     const [open, setOpen] = useState(false)
     const curriedSetOpen = bool => () => setOpen(bool)

     return (
          <Fragment>
               <Button
                    onClick={o(curriedSetOpen(true), e => (iconButton = e.target))}
				//color="inherit"
				variant="contained"
               >
			{isNotMobile && userInfo && userInfo.userName}
                    <AccountCircle className={isNotMobile && classes.rightIcon}/>
               </Button>
               <Menu
                    id="menu-appbar"
                    anchorEl={iconButton}
                    anchorOrigin={{
                         vertical: 'top',
                         horizontal: 'right'
                    }}
                    transformOrigin={{
                         vertical: 'top',
                         horizontal: 'right'
                    }}
                    open={open}
                    onClose={curriedSetOpen(false)}
               >
                    <MenuItem>Můj účet</MenuItem>
                    <MenuItem
                         onClick={() => {
                              setOpen(false)
                              logOutAction()
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
               logOutAction: userLogOut
          },
          dispatch
     )
export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(UserMenu))
