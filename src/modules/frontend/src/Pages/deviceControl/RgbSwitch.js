import React, { Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Content as Switch } from './Swich'
import MenuItem from '@material-ui/core/MenuItem'
import boxHoc from './components/boxHoc'
import TuneIcon from '@material-ui/icons/Tune';
import IconButton from '@material-ui/core/IconButton'
import FieldConnector from 'framework-ui/src/Components/FieldConnector'
import { RgbTypes, LINEAR_TYPE } from "../../constants"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from 'framework-ui/src/Components/Loader'
import ColorPicker from './components/ColorPicker'
import { validateRegisteredFields, fillForm } from 'framework-ui/src/redux/actions/formsData'
import { getFormData, getFieldVal } from 'framework-ui/src/utils/getters'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const styles = theme => ({
    button: {
        position: 'absolute',
        left: 5,
        top: 3
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
    },
    colorWrap: {
        width: 196,
        margin: `${theme.spacing(2)}px auto 0`
    },
    actions: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    loader: {
        position: "absolute",
        margin: "0 auto"
    }
})

function RgbSwitch({
    classes,
    name,
    colorType,
    description,
    onClick,
    data,
    ackTime,
    afk,
    pending,
    forceUpdate,
    validateForm,
    formData,
    fillForm,
    ...props }) {
    const [open, setOpen] = useState(false)
    const [myPending, setMyPending] = useState(false)
    const { state = { on: 0 } } = data;
    const { on } = state;

    const onClose = () => setOpen(false);
    const handleAgree = async () => {
        if (validateForm().valid) {
            setMyPending(true)
            await onClick({ ...formData, on: 1 })
            setMyPending(false)
        }
    }
    const handleOpen = () => {
        fillForm({ type: state.type, color: state.color })
        setOpen(true)
    }

    return (
        <Fragment>
            <Switch
                name={name}
                data={{state: on}}
                ackTime={ackTime}
                pending={pending}
                afk={afk}
                onClick={() => !afk && !pending && onClick({ ...state, on: on === 1 ? 0 : 1 })}
            />
            <IconButton size="small" className={classes.button} onClick={handleOpen}>
                <TuneIcon className={classes.icon} />
            </IconButton>

            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Změna barvy</DialogTitle>
                <DialogContent className={classes.content}>
                    <FieldConnector
                        component="Select"
                        deepPath='EDIT_RGB.type'
                        selectOptions={RgbTypes
                            .map(
                                ({ value, label }) =>
                                    (<MenuItem value={value} key={value}>
                                        {label}
                                    </MenuItem>)
                            )}
                    />


                    {LINEAR_TYPE == colorType ? <FieldConnector
                        deepPath="EDIT_RGB.color"
                        component={ColorPicker}
                    /> : null}
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button onClick={onClose} color="primary">
                        Zrušit
                    </Button>
                    <div className={classes.agreeButton}>
                        <Button onClick={handleAgree} color="primary" autoFocus disabled={myPending} >
                            Uložit
                            <Loader open={myPending} className={classes.loader} />
                        </Button>

                    </div>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

const component = withStyles(styles)(RgbSwitch)

const _mapStateToProps = state => ({
    formData: getFormData("EDIT_RGB")(state),
    colorType: getFieldVal("EDIT_RGB.type")(state)
})

const _mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            validateForm: validateRegisteredFields("EDIT_RGB"),
            fillForm: fillForm("EDIT_RGB")
        },
        dispatch
    )

export default boxHoc(connect(_mapStateToProps, _mapDispatchToProps)(component))