import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'
import { Link } from 'react-router-dom'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Cloud from '@material-ui/icons/Cloud'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getPaths } from 'framework-ui/src/privileges'
import { getUserPresence, getGroups } from 'framework-ui/src/utils/getters'
import uiMessages from '../../localization/ui';

const styles = {
     list: {
          width: 250
     },
     fullList: {
          width: 'auto'
     }
}

function createMenuListItem({ path, name, Icon }, index) {
     return (
          <Link to={path} key={path}>
               <ListItem button>
                    <ListItemIcon>
                         <Icon />
                    </ListItemIcon>
                    <ListItemText primary={uiMessages.getMessage(name)} />
               </ListItem>
          </Link>
     )
}

function SideMenu({ classes, open, onClose, onOpen, userPresence, userGroups }) {
     const userRoutes = userPresence ? getPaths(userGroups) : []

     return (
          <SwipeableDrawer open={open} onClose={onClose} onOpen={onOpen}>
               <div tabIndex={0} role="button" onClick={onClose} onKeyDown={onClose}>
                    <div className={classes.list}>
                         <List>
                              <ListSubheader>Menu</ListSubheader>
                              {[{ path: '/', name: 'sensors', Icon: Cloud }, ...userRoutes].map(createMenuListItem)}
                         </List>
                         <Divider />
                         <List>
                              {[{ path: '/registerUser', name: 'registration', Icon: AccountCircle }].map(createMenuListItem)}
                         </List>
                    </div>
               </div>
          </SwipeableDrawer>
     )
}

const _mapStateToProps = state => ({
     userPresence: getUserPresence(state),
     userGroups: getGroups(state)
})

const _mapActionsToProps = dispatch => bindActionCreators({}, dispatch)
export default connect(
     _mapStateToProps,
     _mapActionsToProps
)(withStyles(styles)(SideMenu))
