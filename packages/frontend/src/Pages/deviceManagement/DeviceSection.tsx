import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DeviceCommand, IDevice, IDeviceStatus } from 'common/src/models/interface/device';
import { default as AlertDialog, default as Dialog } from 'framework-ui/src/Components/Dialog';
import EnchancedTable from 'framework-ui/src/Components/Table';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';
import { isUrlHash } from 'framework-ui/src/utils/getters';
import { useAppSelector } from 'frontend/src/hooks';
import { useManagementStyles } from 'frontend/src/hooks/useManagementStyles';
import { Device } from 'frontend/src/store/reducers/application/devices';
import { getDevice, getQueryID, getThingEntities } from 'frontend/src/utils/getters';
import { assoc, pick, prop } from 'ramda';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import OnlineCircle from '../../components/OnlineCircle';
import { devicesActions } from '../../store/actions/application/devices';
import EditDeviceForm from './EditDeviceForm';

interface DiscoverySectionProps {
    devices?: Device[];
    resetFormAction: any;
    setFormDataAction: any;
    updateDeviceAction: any;
    deleteDeviceAction: any;
    setFormField: any;
    sendDeviceCommandA: any;
}

function DiscoverySection({
    devices = [],
    resetFormAction,
    setFormDataAction,
    updateDeviceAction,
    deleteDeviceAction,
    setFormField,
    sendDeviceCommandA,
}: DiscoverySectionProps) {
    const deviceId = useAppSelector(getQueryID);
    const selectedDevice = useAppSelector(getDevice(deviceId));
    const openEditDialog = useAppSelector(isUrlHash('#edit'));
    const things = useAppSelector(getThingEntities);

    const classes = useManagementStyles();
    const [menuForId, setMenuForId] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const history = useHistory();
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('xs'));

    useEffect(() => {
        if (selectedDevice)
            setFormDataAction({ formName: 'EDIT_DEVICE', data: pick(['info', 'permissions'], selectedDevice) });
    }, [selectedDevice, setFormDataAction]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, deviceId: string) => {
        setAnchorEl(event.currentTarget);
        setMenuForId(deviceId);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function closeDialog() {
        resetFormAction('EDIT_DEVICE');
        setMenuForId('');
        history.push({ hash: '' });
    }

    async function onAgree() {
        const result = await updateDeviceAction(selectedDevice?._id);
        if (result) closeDialog();
    }

    async function onAgreeDelete() {
        setFormField({ deepPath: 'DEVICE_SEND.command', value: DeviceCommand.reset });
        await sendDeviceCommandA(menuForId);
        const result = await deleteDeviceAction(menuForId);
        if (result) {
            setOpenAlertDialog(false);
            history.push({ hash: '' });
        }
    }

    return (
        <Fragment>
            <EnchancedTable
                customClasses={{
                    tableWrapper: classes.tableWrapper,
                    toolbar: classes.toolbar,
                    pagination: classes.pagination,
                }}
                dataProps={[
                    { path: 'info.name', label: 'Název' },
                    { path: 'metadata.deviceId', label: 'ID zařízení' },
                    {
                        path: 'info.location',
                        label: 'Umístění',
                        convertor: ({ building, room }: Device['info']['location']) => `${building}/${room}`,
                    },
                    {
                        path: 'things',
                        label: 'Věci',
                        convertor: (thingIds: Device['things']) =>
                            thingIds.map((id) => things[id]?.config.name).join(', '),
                    },
                    {
                        path: 'createdAt',
                        label: 'Vytvořeno',
                        convertor: (date: string) => new Date(date).toLocaleDateString(),
                    },
                    {
                        path: 'state.status',
                        label: 'Status',
                        convertor: (status: IDeviceStatus) => <OnlineCircle status={status} inTransition={false} />,
                    },
                ]}
                enableSearch={isWide}
                data={devices}
                toolbarHead="Správa zařízení"
                orderBy="info.name"
                enableEdit
                customEditButton={(id: string, device: Device) =>
                    device.permissions.write?.length > 0 ? (
                        <IconButton aria-label="add" size="small" onClick={(e) => handleClick(e, id)}>
                            <MoreVertIcon />
                        </IconButton>
                    ) : null
                }
                rowsPerPage={10}
            />

            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <Link to={{ hash: 'edit', search: '?id=' + menuForId }}>
                    <MenuItem onClick={handleClose}>Editovat</MenuItem>
                </Link>
                <MenuItem
                    onClick={() => {
                        setFormField({ deepPath: 'DEVICE_SEND.command', value: DeviceCommand.restart });
                        sendDeviceCommandA(menuForId);
                        handleClose();
                    }}
                >
                    Restartovat
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        setOpenAlertDialog(true);
                        handleClose();
                    }}
                >
                    Smazat
                </MenuItem>
            </Menu>
            {/* <FullScreenForm
                open={openEditDialog}
                heading="Editace zařízení"
                onAgree={onAgree}
                onClose={closeDialog}
            >
                <EditDeviceForm />
            </FullScreenForm> */}
            <Dialog
                open={openEditDialog}
                title="Editace zařízení"
                cancelText="Zrušit"
                agreeText="Uložit"
                onAgree={onAgree}
                onClose={closeDialog}
                fullScreen={isSmall}
                content={
                    <Grid container spacing={2}>
                        <EditDeviceForm />
                    </Grid>
                }
            />
            <AlertDialog
                title="Odstranění zařízení"
                content="Opravdu chcete odstranit toto zařízení? Tato akce je nevratná. Pokud je zařízení online, tak obdrží příkaz k resetování (uvede se do výchozího stavu)."
                open={openAlertDialog}
                onClose={() => setOpenAlertDialog(false)}
                onAgree={onAgreeDelete}
                cancelText="Zrušit"
            />
        </Fragment>
    );
}

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            resetFormAction: formsDataActions.removeForm,
            // resetEditDeviceAction: formsActions.removeForm('EDIT_DEVICE'),
            // prefillEditForm: formsActions.fillForm('EDIT_DEVICE'),
            setFormDataAction: formsDataActions.setFormData,
            updateDeviceAction: devicesActions.updateDevice,
            deleteDeviceAction: devicesActions.deleteDevice,
            sendDeviceCommandA: devicesActions.sendCommand,
            setFormField: formsDataActions.setFormField,
        },
        dispatch
    );

export default connect(null, _mapDispatchToProps)(DiscoverySection);
