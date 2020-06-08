import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { map } from 'ramda'
import UpdatedBefore from 'framework-ui/src/Components/UpdatedBefore'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import DeviceBox from '../../components/DeviceBox'
import toDateTime from '../../utils/toDateTime'

const styles = theme => ({
     data: {
          fontSize: 15,
     },
     dataContainer: {
          paddingTop: 17,
          display: "flex",
          flexDirection: 'column',
     },
     created: {
          fontSize: 11
     },
     'p+p': {
          paddingTop: 100
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
          const content = <Typography component="span" className={classes.data} color="primary">
               {name} : {currentData && currentData[JSONkey] ? currentData[JSONkey] : "***"} {unit}
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

function SensorBox({ classes, device, enableNotify = false }) {
     const { info: { imgPath, title, description }, sensors, id } = device
     const time = sensors.current ? new Date(sensors.current.updatedAt) : null;
     return (
          <DeviceBox
               actions={
                    <CardActions>
                         {enableNotify ?
                              <Link to={{ hash: `editNotify`, search: `?id=${id}` }}>
                                   <Button size="small" color="primary">
                                        Notify
                              </Button>
                              </Link> : <Button size="small" color="primary" disabled>
                                   Notify
                              </Button>
                         }
                         <Button size="small" color="primary" disabled>
                              Learn More
                              </Button>
                    </ CardActions>
               }
               imgPath={imgPath}
          >
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
                         <Tooltip title={toDateTime(time)} placement="bottom" arrow={true}>
                              <UpdatedBefore updateTime={time} time={time} className={classes.updatedBefore} />
                         </Tooltip>
                    </Fragment> : null}
          </DeviceBox>
     )
}

SensorBox.propTypes = {
     classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SensorBox)
