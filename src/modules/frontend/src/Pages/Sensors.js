import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import SensorBox from './sensors/SensorBox'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getUserPresence, isUrlHash } from 'framework-ui/src/utils/getters'

const styles = theme => ({

})

const fakeData = [
     {
          title: 'Udírna',
          description:
               'Velká dřevěná budka, která zabrala místo borůvce! Postavil ji tatínek a udí v ní jen nedobré kapry brrrrr.',
          imgPath: 'images/smokeHouse.jpg',
          id: 'dasd787897SDADAS',
          order: 0,
          sensors: [
               {
                    name: 'Teplota1',
                    unit: '*C',
                    data: [{ value: 30, timestamp: new Date() }, { value: 31, timestamp: new Date() }]
               }
          ]
     },
     {
          title: 'Meteostanice',
          description:
               'Ručně vyrobená stanice pro měření počásí. Celá je vytisklá na 3D tiskárně a je zde použit wifi čip ESP8266. Bla lsadlas ld asldas',
          imgPath: 'images/weatherStation.jpg',
          id: 'DsadasdasdasdQ424',
          order: 1,
          sensors: [
               { name: 'Teplota', unit: '*C', data: [{ value: 17, timestamp: new Date() }] },
               { name: 'Vlhkost', unit: '%', data: [{ value: 59, timestamp: new Date() }] },
               { name: 'Tlak', unit: 'hPa', data: [{ value: 970.37, timestamp: new Date() }] }
          ]
     }
]

function Sensors({ classes, userPresence, openDialog, history }) {
     return (
          <Fragment>
               {fakeData.map(data => (
                    <SensorBox device={data} key={data.id} />
               ))}
               {/* {userPresence && (
                    <Fragment>
                         <Card className={classes.cardPlus}>
                              <div className={classes.wraper}>
                                   <Link to={{ hash: 'createSensor' }}>
                                        <IconButton className={classes.addButton} aria-label="Add an alarm">
                                             <AddCircle className={classes.addIcon} />
                                        </IconButton>
                                   </Link>
                              </div>
                         </Card>
                         {/* <FullScreenDialog
                              open={openDialog}
                              onClose={() => history.push({hash: ""})}
                              heading="Tvorba zařízení"
                         >
                              <CreateSensorDialog />
                         </FullScreenDialog> }
                    </Fragment>
               )} */}
          </Fragment>
     )
}

const _mapStateToProps = state => ({
     userPresence: getUserPresence(state),
     openDialog: isUrlHash('#createSensor')(state)
})

// const _mapDispatchToProps = dispatch =>
//      bindActionCreators(
//           {
//                fetchAllUsers: usersActions.fetchAll,
//                updateUser: usersActions.update,
//                deleteUsers: usersActions.deleteUsers,
//                createUser: usersActions.create,
//                fillUserForm: formsDataActions.fillForm('USER'),
//                resetUserForm: formsDataActions.resetForm('USER')
//           },
//           dispatch
// 	)

export default connect(_mapStateToProps)(withStyles(styles)(Sensors))
