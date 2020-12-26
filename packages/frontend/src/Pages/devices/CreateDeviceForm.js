import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/lib/Components/Loader'
import { bindActionCreators } from 'redux'
import { prop } from 'ramda'

import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import * as sensorsActions from '../../store/actions/application/devices'
import { updateTmpData } from 'framework-ui/lib/redux/actions/tmpData'
import { getDialogTmp } from 'framework-ui/lib/utils/getters'
import InfoAlert from 'framework-ui/lib/Components/InfoAlert'
import ImageUploader from '../../components/ImageUploader'


const styles = theme => ({
    card: {
        position: 'relative',
        width: 600,
        marginTop: 0,
        margin: "0 auto",
        overflow: 'auto',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        },
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
    // content: {
    //     [theme.breakpoints.down('sm')]: {
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center'
    //     }
    // },
    textArea: {
        width: "100%"
    }
})

function CreateDeviceDialog({ classes, createSensorAction, updateTmpDataAction, apiKey, deviceUser }) {
    const [pending, setPending] = useState(false)
    async function handleCreate() {
        setPending(true);
        await createSensorAction()
        setPending(false)
    }

    return (
        <Fragment>
            <Card className={classes.card}>
                <CardHeader className={classes.header} title="Vytvoření zařízení" />
                <CardContent className={classes.content}>
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <FieldConnector
                                deepPath="CREATE_DEVICE.info.title"
                                fieldProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            {/* <FieldConnector
                                component="FileLoader"
                                deepPath="CREATE_DEVICE.info.image"
                            /> */}
                            <ImageUploader
                                deepPath="CREATE_DEVICE.info.image"
                            />
                        </Grid>
                        <Grid item md={6}>
                            <FieldConnector
                                label="Zeměpisná šířka"
                                deepPath="CREATE_DEVICE.gps.coordinates.1"
                                fieldProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <FieldConnector
                                component="TextField"
                                label="Zeměpisná délka"
                                deepPath="CREATE_DEVICE.gps.coordinates.0"
                                fieldProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <FieldConnector
                                fieldProps={{
                                    placeholder: "/house/bedroom/lamp",
                                    fullWidth: true
                                }}
                                className={classes.textArea}
                                deepPath="CREATE_DEVICE.topic"
                            />
                        </Grid>
                        <Grid item md={12}>
                            <FieldConnector
                                component="TextField"
                                fieldProps={{
                                    multiline: true
                                }}
                                className={classes.textArea}
                                deepPath="CREATE_DEVICE.info.description"
                            />
                        </Grid>
                        <Grid item md={12}>
                            <FieldConnector
                                component="CheckBox"
                                deepPath="CREATE_DEVICE.publicRead"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={handleCreate}
                        disabled={pending}
                    >
                        Vytvořit
                         </Button>
                    <Loader open={pending} />
                </CardActions>
            </Card>
            <InfoAlert
                title={`Váš API Key pro zařízení:	${apiKey}`}
                content="Tímto klíčem se bude zařízení autorizovat serveru, pro zajištění důvěry."
                onClose={() => updateTmpDataAction({ dialog: {} })}
                open={!!apiKey}
            />
        </Fragment>
    )
}

const _mapStateToProps = state => ({
    apiKey: prop("apiKey")(getDialogTmp(state)),
})

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            createSensorAction: sensorsActions.createDevice,
            updateTmpDataAction: updateTmpData
        },
        dispatch
    )

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(withStyles(styles)(CreateDeviceDialog))
