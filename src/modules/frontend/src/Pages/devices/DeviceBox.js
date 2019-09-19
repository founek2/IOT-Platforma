import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconSettings from '@material-ui/icons/Settings'
import Fab from '@material-ui/core/Fab'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import AlertDialog from 'framework-ui/src/Components/AlertDialog'

const styles = theme => ({
     card: {
          width: '25%',
          float: 'left',
          marginBottom: 1,
          position: 'relative',
          [theme.breakpoints.down('sm')]: {
               width: '100%'
          }
     },
     media: {
          height: 0,
          paddingTop: '56.25%' // 16:9
     },
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
     content: {
          [theme.breakpoints.up('md')]: {
               height: 160,
               paddingLeft: theme.spacing(3),
               paddingRight: theme.spacing(3),
               paddingBottom: 0
          }
     },
     description: {
          maxHeight: 72,
          overflowY: 'scroll'
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

const ref = React.createRef();

function DeviceBox({ classes, device, onDelete }) {
     const [anchorEl, setAnchorEl] = useState(null)
     const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
     const { title, description, imgPath, gps, id } = device

     function handleClick(event) {
          setAnchorEl(event.currentTarget);
     }
     function handleClose() {
          setAnchorEl(null);
     }

     return (
          <Card className={classes.card}>
               <CardMedia className={classes.media} image={imgPath} />
               <CardContent className={classes.content}>
                    <Typography gutterBottom variant="h5" component="h2">
                         {title}
                    </Typography>
                    <Typography component="p" className={classes.description}>
                         {description}
                    </Typography>
                    <div className={classes.dataContainer}>
                    </div>
               </CardContent>
               <CardActions>
                    {/* <Button size="small" color="primary" disabled>
                              Notify
                         </Button> */}
                    <Button size="small" color="primary" disabled>
                         Mapa
                         </Button>
               </CardActions>
               <Fab size="small" className={classes.settingsFab} onClick={handleClick} >
                    <IconSettings />
               </Fab>
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
                    <Link to={{ hash: `editPermissions`, search: `?id=${id}` }}>
                         <MenuItem onClick={handleClose}>Oprávnění</MenuItem>
                    </Link>
                    <MenuItem onClick={() => { handleClose(); setOpenDeleteDialog(true) }}>Smazat</MenuItem>
               </Menu>
               <AlertDialog
                    open={openDeleteDialog}
                    onAgree={async () => await onDelete(device.id)}
                    onClose={() => setOpenDeleteDialog(false)}
                    title="Odstranění zařízení"
                    notDisablePending
                    content="Opravdu chcete odstranit zařízení? Tato akce je nevratná."
               />
          </Card>
     )
}
DeviceBox.propTypes = {
     classes: PropTypes.object.isRequired
}

const _mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
     null,
     _mapDispatchToProps
)(withStyles(styles)(DeviceBox))
