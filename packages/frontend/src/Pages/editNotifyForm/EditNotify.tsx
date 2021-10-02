import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import { NotifyIntervals } from 'common/lib/constants';
import { IThing } from 'common/lib/models/interface/thing';
import FieldConnector from 'framework-ui/lib/Components/FieldConnector';
import { getFieldVal } from 'framework-ui/lib/utils/getters';
import { RootState } from 'frontend/src/store/store';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import DaysOfWeekPicker from './DaysOfWeekPicker';
import PropertyPart from './editNotify/PropertyPart';


const useStyles = makeStyles((theme) => ({
    quantity: {
        marginTop: 30,
        position: 'relative',
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: -15,
    },
    advanced: {
        textAlign: 'center',
        fontSize: 12,
        cursor: 'pointer',
        marginTop: 8,
        userSelect: 'none',
    },
    daysPicker: {
        maxWidth: 350,
        // display: "flex",
        margin: '0 auto',
    },
}));

interface EditNotifyProps {
    id: number;
    onDelete: (id: number) => void;
    config: IThing['config'];
    editedAdvanced: boolean;
}

function EditNotify({ id, onDelete, config, editedAdvanced }: EditNotifyProps) {
    const [openAdvanced, setOpen] = useState(false);
    const classes = useStyles();

    return (
        <Grid container key={id} spacing={2} className={classes.quantity}>
            <Grid item md={12}>
                <FormLabel component="legend">Notifikace {id}:</FormLabel>
                <IconButton className={classes.clearButton} aria-label="Delete a sensor" onClick={(e) => onDelete(id)}>
                    <ClearIcon />
                </IconButton>
            </Grid>

            <PropertyPart config={config} id={id} />
            {/* <Grid item md={12} xs={12}>
            <FieldConnector
                fieldProps={{
                    type: 'text',
                    multiline: true,
                    fullWidth: true
                }}
                deepPath={`EDIT_NOTIFY.description.${id}`}
            />
        </Grid> */}
            <Grid item md={12} xs={12}>
                <Typography className={classes.advanced} color="primary" onClick={() => setOpen(!openAdvanced)}>
                    Rozšířené {editedAdvanced && '⭣'}
                </Typography>
            </Grid>
            {openAdvanced && (
                <Fragment>
                    {/* <div className={classes.contentInner}> */}
                    <Grid item md={4} xs={12}>
                        <FieldConnector
                            component="Select"
                            deepPath={`EDIT_NOTIFY.advanced.interval.${id}`}
                            selectOptions={NotifyIntervals.map(({ value, label }) => (
                                <MenuItem value={value} key={value}>
                                    {label}
                                </MenuItem>
                            ))}
                            fieldProps={{
                                fullWidth: true,
                            }}
                        />
                    </Grid>
                    <Grid item md={2} xs={6}>
                        <FieldConnector
                            deepPath={`EDIT_NOTIFY.advanced.from.${id}`}
                            fieldProps={{
                                // defaultValue: "00:00",
                                fullWidth: true,
                                type: 'time',
                            }}
                        />
                    </Grid>
                    <Grid item md={2} xs={6}>
                        <FieldConnector
                            deepPath={`EDIT_NOTIFY.advanced.to.${id}`}
                            fieldProps={{
                                // defaultValue: "23:59",
                                fullWidth: true,
                                type: 'time',
                            }}
                        />
                    </Grid>
                    {/* </div> */}
                    <Grid item md={12} xs={12}>
                        <div className={classes.daysPicker}>
                            <FieldConnector
                                deepPath={`EDIT_NOTIFY.advanced.daysOfWeek.${id}`}
                                component={(props) => <DaysOfWeekPicker {...props} />}
                            />
                        </div>
                    </Grid>
                </Fragment>
            )}
        </Grid>
    );
}

const _mapStateToProps = (state: RootState, { id }: { id: number }) => {
    const days = getFieldVal(`EDIT_NOTIFY.advanced.daysOfWeek.${id}`, state);
    const editedAdvanced =
        getFieldVal(`EDIT_NOTIFY.advanced.to.${id}`, state) ||
        getFieldVal(`EDIT_NOTIFY.advanced.from.${id}`, state) ||
        (days && days.length < 7);

    return {
        editedAdvanced: !!editedAdvanced,
    };
};

export default connect(_mapStateToProps)(EditNotify);
