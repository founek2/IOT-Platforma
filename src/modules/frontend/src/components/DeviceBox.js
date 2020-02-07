import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { map, last } from 'ramda'
import UpdatedBefore from 'framework-ui/src/Components/UpdatedBefore'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import {IMAGES_PREFIX_FOLDER} from '../constants'

const styles = theme => ({
     card: {
          width: "25%",
          float: 'left',
          marginBottom: 1,
            position: 'relative',
          [theme.breakpoints.down('sm')]: {
               width: "100%"
          },
     },
     media: {
          height: 0,
          paddingTop: '56.25%' // 16:9
     },
     data: {
          fontSize: 15
     },
     dataContainer: {
          paddingTop: 17
     },
     created: {
          fontSize: 11
     },
     content: {
          position: "relative",
          [theme.breakpoints.up('md')]: {
               height: 250,
               paddingLeft: theme.spacing(3),
               paddingRight: theme.spacing(3),
               paddingBottom: 0
          },
     },
     description: {
          maxHeight: 72,
          overflowY: 'scroll'
     },
     updatedBefore: {
          fontSize: 11,
          textAlign: "right",
          [theme.breakpoints.up('md')]: {
               paddingRight: theme.spacing(3),
               position: "absolute",
               right: 0,
               bottom: 0
               
          },
     }

})

class DeviceBox extends React.Component {
     render() {
          const { classes, imgPath, actions, children, root } = this.props

          return (
               <Card className={`deviceBox ${classes.card}`}>
                    <CardMedia className={classes.media} image={IMAGES_PREFIX_FOLDER + imgPath} />
                    <CardContent className={classes.content}>
                         {children}
                    </CardContent>
                    <CardActions>
                         {actions}
                    </CardActions>
                    {root}
               </Card>
          )
     }
}
DeviceBox.propTypes = {
     classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DeviceBox)
