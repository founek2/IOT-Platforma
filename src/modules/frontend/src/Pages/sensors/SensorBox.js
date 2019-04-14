import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { map, last } from 'ramda'

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
		[theme.breakpoints.up('md')]: {
			height: 215,
			paddingLeft: theme.spacing.unit * 3,
			paddingRight: theme.spacing.unit * 3,
			paddingBottom: 0
		},
     },
     description: {
          maxHeight: 63,
          overflow: 'scroll'
	},

})

function convertDataView(classes) {
     return ({ name, unit, data }) => (
          <Typography component="p" className={classes.data} color="primary" key={name}>
               {name} : {last(data).value} {unit}
          </Typography>
     )
}

class SensorBox extends React.Component {
     render() {
          const { classes } = this.props

          const { title, description, sensors, imgPath } = this.props.device

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
                         <div className={classes.dataContainer}>{map(convertDataView(classes), sensors)}</div>
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
