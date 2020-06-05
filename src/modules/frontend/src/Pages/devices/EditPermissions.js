import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { bindActionCreators } from 'redux'
import { map } from 'ramda'

import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import * as deviceActions from '../../store/actions/application/devices'
import { getUserNames } from '../../utils/getters'
import * as formsActions from 'framework-ui/src/redux/actions/formsData'
import Typography from '@material-ui/core/Typography';
import * as userNamesActions from '../../store/actions/application/userNames'

const styles = theme => ({
    card: {
        overflow: 'auto',
        margin: '0px auto',
        position: 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 800,
        marginTop: 0,

        [theme.breakpoints.down('sm')]: {
            width: '100%'
            //height: '100%'
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        },
        [theme.breakpoints.up('lg')]: {
            //height: 410
        }
    },
    actions: {
        marginBottom: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(2)
        },
        margin: 'auto',
        width: 400,
        justifyContent: 'center',

        [theme.breakpoints.down('sm')]: {
            width: '100%',
            justifyContent: 'flex-start',
            flexDirection: 'column'
        }
    },
    header: {
        paddingBottom: 0,
        paddingTop: theme.spacing(4),
        textAlign: 'center'
    },
    content: {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            textAlign: 'center',
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        display: "flex",
        flexWrap: "wrap"
    },
    loader: {
        left: 138,
        top: -12
    },
    chipArray: {
        width: "50%",
        maxHeight: 200,
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            width: '100%'
            //height: '100%'
        },
    }

})

function EditDeviceDialog({ fillEditFormAction, device, classes, updatePermissionsAction, fetchUserNamesAction, userNames }) {
    useEffect(() => {
        fillEditFormAction(device.permissions)
        fetchUserNamesAction()
    }, [])
    const [pending, setPending] = useState(false)
    const handleSave = async () => {
        setPending(true)
        await updatePermissionsAction(device.id)
        setPending(false)
    }

    return device ? (
        <Fragment>
            <Card className={classes.card}>
                <CardHeader className={classes.header} title={device.title} titleTypographyProps={{ variant: "h3" }} />
                <CardContent className={classes.content}>
                    {userNames.data ?
                        <Fragment>
                            <FieldConnector
                                deepPath="EDIT_PERMISSIONS.read"
                                component="ChipArray"
                                optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                                className={classes.chipArray}
                            />
                            <FieldConnector
                                deepPath="EDIT_PERMISSIONS.write"
                                component="ChipArray"
                                optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                                className={classes.chipArray}
                            />
                            <FieldConnector
                                deepPath="EDIT_PERMISSIONS.control"
                                component="ChipArray"
                                optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                                className={classes.chipArray}
                            />
                        </Fragment> : <Typography component="span">Načítám uživatele <Loader open className={classes.loader} /></Typography>}
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={handleSave}
                        disabled={pending}
                    >
                        Uložit
                              </Button>
                    <Loader open={pending} />
                </CardActions>
            </Card>
        </Fragment>
    ) : (
            <div />
        ) // redux is faster than closing -> before close is device undefined
}


const _mapStateToProps = state => {
    return {
        userNames: getUserNames(state)
    }
}

const _mapDispatchToProps = dispatch => (
    {
        ...bindActionCreators(
            {
                fillEditFormAction: formsActions.fillForm('EDIT_PERMISSIONS'),
                fetchUserNamesAction: userNamesActions.fetch,
                updatePermissionsAction: deviceActions.updatePermissions
            },
            dispatch
        ),
        dispatch,
    })

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(withStyles(styles)(EditDeviceDialog))
