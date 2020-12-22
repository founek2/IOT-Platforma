import React, { Fragment, useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import IconButton from '@material-ui/core/IconButton'
import FileCopy from '@material-ui/icons/FileCopy'
import { connect } from 'react-redux'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/lib/Components/Loader'
import { bindActionCreators } from 'redux'
import { prop, omit } from 'ramda'
import { IMAGES_PREFIX_FOLDER } from '../../constants'

import FieldConnector from 'framework-ui/lib/Components/FieldConnector'
import * as deviceActions from '../../store/actions/application/devices'
import { updateTmpData } from 'framework-ui/lib/redux/actions/tmpData'
import { getDialogTmp, getFieldVal, getRegisteredField } from 'framework-ui/lib/utils/getters'
import InfoAlert from 'framework-ui/lib/Components/InfoAlert'
import * as formsActions from 'framework-ui/lib/redux/actions/formsData'
import Dialog from 'framework-ui/lib/Components/Dialog'
import TextField from 'framework-ui/lib/Components/fieldConnector/TextField.js'
import CopyToClipboard from 'framework-ui/lib/Components/CopyToClipboard'

const styles = theme => ({
    textArea: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${theme.spacing(2)}px)`
        }
    },
    topicWrapper: {
        display: "inline-flex",
        [theme.breakpoints.down('sm')]: {
            width: "90%",
        },
        width: '100%'
    },
    topic: {
        [theme.breakpoints.up('sm')]: {
            width: "calc(100% - 58px)"
        },
    },
    card: {
        overflow: 'auto',
        margin: '0px auto',
        position: 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 650,
        marginTop: 0,

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        },
    },
    actions: {
        marginBottom: theme.spacing(2),
        width: "100%",
        justifyContent: 'center',

        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(2)
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        }
    },
    header: {
        paddingBottom: 0,
        paddingTop: theme.spacing(4),
        textAlign: 'center'
    },
    content: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(6),
            paddingRight: theme.spacing(6),
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            textAlign: "center",
        }
    },
    contentInner: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        }
    },
    media: {
        height: 0,
        paddingTop: '56.25%' // 16:9
    },
    mediaWrapper: {
        display: "inline-block",
        width: 300,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            width: '90%',
        }
    },
})

function EditDeviceDialog({ classes, updateDeviceAction, updateTmpDataAction, apiKey, device, fillEditFormAction, deleteDeviceAction, editFormTopic, fetchApiKeyAction, topicRegisteredField, newImg }) {
    useEffect(() => {
        const { info, publicRead, topic, gps } = device

        fillEditFormAction({ info: omit(["imgPath"], info), publicRead, topic, gps })
    }, [])
    const [pending, setPending] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openTopicDialog, setOpenTopicDialog] = useState(false)

    const handleSave = async () => {
        setPending(true)
        await updateDeviceAction(device.id)
        setPending(false)
    }

    const handleFetchApiKey = async () => {
        setPending(true)
        await fetchApiKeyAction(device.id)
        setPending(false)
    }
    const topicVal = (device && `/${device.createdBy}${editFormTopic || ""}`) || ""
    return device ? (
        <Fragment>
            <Card className={classes.card}>
                <CardHeader className={classes.header} title={device.title} />
                <CardContent className={classes.content}>
                    <div className={classes.contentInner}>
                        <div>
                            <div className={classes.mediaWrapper}>
                                <CardMedia className={classes.media} image={(newImg && newImg.url) || IMAGES_PREFIX_FOLDER + device.info.imgPath} />
                            </div>
                            <FieldConnector
                                component="FileLoader"
                                fieldProps={{
                                    className: classes.textArea
                                }}
                                deepPath="EDIT_DEVICE.info.image"
                            />
                        </div>
                        <div>
                            <FieldConnector
                                component="TextField"
                                deepPath="EDIT_DEVICE.info.title"
                            />
                            <FieldConnector
                                label="Zeměpisná šířka"
                                deepPath="EDIT_DEVICE.gps.coordinates.1"
                            />
                            <FieldConnector
                                label="Zeměpisná délka"
                                deepPath="EDIT_DEVICE.gps.coordinates.0"
                            />
                        </div>
                    </div>
                    <FieldConnector
                        component="TextField"
                        fieldProps={{
                            type: 'text',
                            className: classes.textArea,
                            multiline: true
                        }}
                        deepPath="EDIT_DEVICE.info.description"
                    />
                    <div className={classes.topicWrapper}>
                        <TextField
                            className={classes.topic}
                            value={topicVal}
                            error={topicRegisteredField ? !topicRegisteredField.valid : false}
                            helperText={topicRegisteredField && topicRegisteredField.errorMessages ? topicRegisteredField.errorMessages[0] : ""}
                            FormHelperTextProps={{ error: topicRegisteredField ? !topicRegisteredField.valid : false }}
                            disabled
                            label="Topic"
                            inputProps={{ style: { cursor: "pointer" } }}
                            onClick={() => setOpenTopicDialog(true)}
                        />
                        <CopyToClipboard TooltipProps={{ title: "Zkopírováno do schránky" }}>
                            {({ copy }) => (

                                <IconButton onClick={() => copy(topicVal)}>
                                    <FileCopy />
                                </IconButton>
                            )}
                        </CopyToClipboard>
                    </div>
                    <FieldConnector
                        component="Checkbox"
                        deepPath="EDIT_DEVICE.publicRead"
                    />
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={() => setOpenDeleteDialog(true)}
                        disabled={pending}
                    >
                        Smazat
                              </Button>
                    <Button
                        variant="contained"
                        className={classes.button}
                        onClick={handleFetchApiKey}
                        disabled={pending}
                    >
                        API klíč
                              </Button>
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
            <InfoAlert
                title={`Váš API Key pro zařízení:	${apiKey}`}
                content="Tímto klíčem se bude zařízení autorizovat serveru, pro zajištění důvěry."
                onClose={() => updateTmpDataAction({ dialog: {} })}
                open={!!apiKey}
            />
            <Dialog
                open={openDeleteDialog}
                onAgree={async () => {
                    await deleteDeviceAction(device.id)
                    return setOpenDeleteDialog(false)
                }}
                onClose={() => setOpenDeleteDialog(false)}
                title="Odstranění zařízení"
                content="Opravdu chcete odstranit zařízení? Tato akce je nevratná."
                cancelText="Zrušit"
            />
            <Dialog
                open={openTopicDialog}
                onAgree={() => setOpenTopicDialog(false)}
                onClose={() => setOpenTopicDialog(false)}
                title="Upozornění!"
                agreeText="Zavřít"
                content={
                    <Fragment>
                        <DialogContentText>
                            Pokud upravíte topic, tak je třeba pře-flashovat zařízení, aby si stáhl aktuální topic do paměti jinak přestane fungovat.
                         </DialogContentText>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.topic"
                            autoFocus
                            onEnter={() => setOpenTopicDialog(false)}
                            className={classes.textArea}
                        />
                    </Fragment>
                }
            />
        </Fragment>
    ) : (
            <div />
        ) // onClose is removed id from url -> device is undefined before complete close
}

const _mapStateToProps = state => {
    return {
        apiKey: prop('apiKey')(getDialogTmp(state)),
        editFormTopic: getFieldVal("EDIT_DEVICE.topic", state),
        topicRegisteredField: getRegisteredField("EDIT_DEVICE.topic", state),
        newImg: getFieldVal("EDIT_DEVICE.info.image", state)
    }
}

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            updateDeviceAction: deviceActions.updateDevice,
            updateTmpDataAction: updateTmpData,
            fillEditFormAction: formsActions.fillForm('EDIT_DEVICE'),
            deleteDeviceAction: deviceActions.deleteDevice,
            fetchApiKeyAction: deviceActions.fetchApiKey,
        },
        dispatch
    )

export default connect(
    _mapStateToProps,
    _mapDispatchToProps
)(withStyles(styles)(EditDeviceDialog))
