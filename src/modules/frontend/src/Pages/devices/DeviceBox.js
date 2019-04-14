import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { map, last, pick } from 'ramda'
import IconSettings from '@material-ui/icons/Settings'
import IconEdit from '@material-ui/icons/Edit'
import Fab from '@material-ui/core/Fab'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
               paddingLeft: theme.spacing.unit * 3,
               paddingRight: theme.spacing.unit * 3,
               paddingBottom: 0
          }
     },
     description: {
          maxHeight: 63,
          overflow: 'scroll'
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
     iconEdit: {
          position: 'absolute',
          right: 0,
          top: 0,
          backgroundColor: 'white',
          boxShadow: 'none'
     }
})

function convertDataView(classes) {
     return ({ name, unit, data }) => (
          <Typography component="p" className={classes.data} color="primary" key={name}>
               {name} : {last(data).value} {unit}
          </Typography>
     )
}

class DeviceBox extends React.Component {
     render() {
          const { classes, device } = this.props

          const { title, description, imgPath, gps, id } = device

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
                              {/* {map(convertDataView(classes), sensors)} */}
                              <Link to={{ hash: `editSensors`, search: `?id=${id}` }}>
                                   <Fab size="small" className={classes.iconEdit}>
                                        <IconEdit />
                                   </Fab>
                              </Link>
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
                    <Link to={{ hash: `editDevice`, search: `?id=${id}` }}>
                         <Fab size="small" className={classes.settingsFab}>
                              <IconSettings />
                         </Fab>
                    </Link>
               </Card>
          )
     }
}
DeviceBox.propTypes = {
     classes: PropTypes.object.isRequired
}

const _mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
     null,
     _mapDispatchToProps
)(withStyles(styles)(DeviceBox))
