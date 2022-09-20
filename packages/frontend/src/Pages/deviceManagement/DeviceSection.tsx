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
import { useAppDispatch, useAppSelector } from 'frontend/src/hooks';
import { useManagementStyles } from 'frontend/src/hooks/useManagementStyles';
import { Device } from 'frontend/src/store/reducers/application/devices';
import { getDevice, getQueryID, getThingEntities } from 'frontend/src/utils/getters';
import { assoc, pick, prop } from 'ramda';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import OnlineCircle from '../../components/OnlineCircle';
import { devicesActions } from '../../store/actions/application/devices';
import EditDeviceForm from './EditDeviceForm';

interface DiscoverySectionProps {
    devices?: Device[];
}

function DiscoverySection({ devices = [] }: DiscoverySectionProps) {
    const deviceId = useAppSelector(getQueryID);
    const selectedDevice = useAppSelector(getDevice(deviceId));
    const openEditDialog = useAppSelector(isUrlHash('#edit'));
    const things = useAppSelector(getThingEntities);

    const classes = useManagementStyles();
    const [menuForId, setMenuForId] = useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('xs'));
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (selectedDevice)
            dispatch(
                formsDataActions.setFormData({
                    formName: 'EDIT_DEVICE',
                    data: pick(['info', 'permissions'], selectedDevice),
                })
            );
    }, [selectedDevice, dispatch]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, deviceId: string) => {
        setAnchorEl(event.currentTarget);
        setMenuForId(deviceId);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function closeDialog() {
        dispatch(formsDataActions.removeForm('EDIT_DEVICE'));
        setMenuForId('');
        navigate({ hash: '' });
    }

    async function onAgree() {
        const result = await dispatch(devicesActions.updateDevice(selectedDevice?._id));
        if (result) closeDialog();
    }

    async function onAgreeDelete() {
        dispatch(formsDataActions.setFormField({ deepPath: 'DEVICE_SEND.command', value: DeviceCommand.reset }));
        await dispatch(devicesActions.sendCommand(menuForId));
        const result = await dispatch(devicesActions.deleteDevice(menuForId));
        if (result) {
            setOpenAlertDialog(false);
            navigate({ hash: '' });
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
                        dispatch(
                            formsDataActions.setFormField({
                                deepPath: 'DEVICE_SEND.command',
                                value: DeviceCommand.restart,
                            })
                        );
                        dispatch(devicesActions.sendCommand(menuForId));
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

export default DiscoverySection;
