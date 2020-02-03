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

const styles = theme => ({
     card: {
          width: "25%",
          float: 'left',
          marginBottom: 1,

          [theme.breakpoints.down('sm')]: {
               width: "100%"
          },
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
          paddingTop: 17
     },
     created: {
          fontSize: 11
     },
     'p+p': {
          paddingTop: 100
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

function convertDataView(classes, currentData, id) {
     return ({ name, unit, JSONkey, description }) => {
          const content = <Typography component="p" className={classes.data} color="primary">
               {name} : {currentData ? currentData[JSONkey] : "***"} {unit}
          </Typography>
          const contentFInal = description ? <Tooltip title={description} placement="left">
               {content}
          </Tooltip> : content
          return (
               <Link to={{ pathname: `/sensor/${id}`, search: `?name=${name}` }} key={JSONkey}>
                    {contentFInal}
               </Link>
          )
     }
}

// TODO přidat komponentu s časem do frameworku - forceUpdate
class SensorBox extends React.Component {
     render() {
          const { classes, device } = this.props

          const { info: {imgPath, title, description}, sensors, id } = device

          return (
               <Card className={classes.card}>
                    <CardMedia className={classes.media} image={imgPath} />
                    <CardContent className={classes.content}>
                         <Link to={`/sensor/${id}`}>
                              <Typography gutterBottom variant="h5" component="h2">
                                   {title}
                              </Typography>
                         </Link>
                         <Typography component="p" className={classes.description}>
                              {description}
                         </Typography>
                         {sensors.current ?
                              <Fragment>
                                   <div className={classes.dataContainer}>{map(convertDataView(classes, sensors.current.data, device.id), sensors.recipe)}</div>
                                   <UpdatedBefore time={new Date(sensors.current.updatedAt)} className={classes.updatedBefore} />
                              </Fragment> : null}
                    </CardContent>
                    <CardActions>
                         <Button size="small" color="primary" disabled>
                              Notify
                         </Button>
                         <Button size="small" color="primary" disabled>
                              Learn More
                         </Button>
                    </CardActions>
               </Card>
          )
     }
}
SensorBox.propTypes = {
     classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SensorBox)
