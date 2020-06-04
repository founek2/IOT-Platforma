import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconSettings from '@material-ui/icons/Settings'
import Fab from '@material-ui/core/Fab'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeviceBox from '../../components/DeviceBox'
import Dialog from 'framework-ui/src/Components/Dialog'

const styles = theme => ({
     data: {
          //  color: "rgba(0, 0, 0, 0.54)",
          fontSize: 15
     },
     dataContainer: {
          paddingTop: 17,
          position: 'relative'
     },
     created: {
          fontSize: 11
     },
     'p+p': {
          paddingTop: 100
     },
     description: {
          maxHeight: 72,
          overflowY: 'auto'
     },
     settingsFab: {
          position: 'absolute',
          right: 10,
          top: 10,
          [theme.breakpoints.down('sm')]: {
               right: 20,
               top: 20
          }
     },
})

function ControlBox({ classes, device, onDelete }) {
     const [anchorEl, setAnchorEl] = useState(null)
     const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
     const { info: { title, description, imgPath }, id } = device

     function handleClick(event) {
          setAnchorEl(event.currentTarget);
     }
     function handleClose() {
          setAnchorEl(null);
     }

     return (
          <Fragment>
               <DeviceBox
                    imgPath={imgPath}
                    actions={
                         <Button size="small" color="primary" disabled>
                              Mapa
                         </Button>
                    }
                    root={
                         <Fab size="small" className={classes.settingsFab} onClick={handleClick} >
                         <IconSettings />
                    </Fab>
                    }
               >

                    <Typography gutterBottom variant="h5" component="h2">
                         {title}
                    </Typography>
                    <Typography component="p" className={classes.description}>
                         {description}
                    </Typography>
               </DeviceBox>
               <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
               >
                    <Link to={{ hash: `editDevice`, search: `?id=${id}` }}>
                         <MenuItem onClick={handleClose}>Nastavení</MenuItem>
                    </Link>
                    <Link to={{ hash: `editSensors`, search: `?id=${id}` }}>
                         <MenuItem onClick={handleClose}>Senzory</MenuItem>
                    </Link>
                    <Link to={{ hash: `editControl`, search: `?id=${id}` }}>
                         <MenuItem onClick={handleClose}>Ovládání</MenuItem>
                    </Link>
                    <Link to={{ hash: `editPermissions`, search: `?id=${id}` }}>
                         <MenuItem onClick={handleClose}>Oprávnění</MenuItem>
                    </Link>
                    <MenuItem onClick={() => { handleClose(); setOpenDeleteDialog(true) }}>Smazat</MenuItem>
               </Menu>
               <Dialog
                    open={openDeleteDialog}
                    onAgree={async () => await onDelete(device.id)}
                    onClose={() => setOpenDeleteDialog(false)}
                    cancelText="Zrušit"
                    title="Odstranění zařízení"
                    content="Opravdu chcete odstranit zařízení? Tato akce je nevratná."
               />
          </Fragment>
     )
}
ControlBox.propTypes = {
     classes: PropTypes.object.isRequired
}

const _mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
     null,
     _mapDispatchToProps
)(withStyles(styles)(ControlBox))
