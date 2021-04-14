import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { DeviceCommand, IDevice, IDeviceStatus } from "common/lib/models/interface/device";
import { IThing } from "common/lib/models/interface/thing";
import { default as AlertDialog, default as Dialog } from "framework-ui/lib/Components/Dialog";
import EnchancedTable from "framework-ui/lib/Components/Table";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { isUrlHash } from "framework-ui/lib/utils/getters";
import { getDevices, getQueryID } from "frontend/src/utils/getters";
import { assoc, pick, prop } from "ramda";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";
import OnlineCircle from "../../components/OnlineCircle";
import * as deviceActions from "../../store/actions/application/devices";
import EditDeviceForm from "./EditDeviceForm";
import FullScreenForm from "frontend/src/components/FullScreenForm";

interface DiscoverySectionProps {
    devices?: IDevice[];
    resetEditDeviceAction: any;
    openEditDialog: boolean;
    selectedDevice?: IDevice;
    prefillEditForm: any;
    updateDeviceAction: any;
    deleteDeviceAction: any;
    setCommandField: any,
    sendDeviceCommandA: any,
}

function DiscoverySection({
    devices,
    resetEditDeviceAction,
    openEditDialog,
    selectedDevice,
    prefillEditForm,
    updateDeviceAction,
    deleteDeviceAction,
    setCommandField,
    sendDeviceCommandA,
}: DiscoverySectionProps) {
    const [menuForId, setMenuForId] = useState("");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const history = useHistory();
    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up("md"));
    const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

    useEffect(() => {
        if (selectedDevice) prefillEditForm(pick(["info", "permissions"], selectedDevice));
    }, [selectedDevice, prefillEditForm]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, deviceId: string) => {
        setAnchorEl(event.currentTarget);
        setMenuForId(deviceId);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function closeDialog() {
        resetEditDeviceAction();
        setMenuForId("");
        history.push({ hash: "" });
    }

    async function onAgree() {
        const result = await updateDeviceAction(selectedDevice?._id);
        console.log("RESULT", result)
        if (result) closeDialog();
    }

    async function onAgreeDelete() {
        setCommandField(DeviceCommand.reset)
        await sendDeviceCommandA(menuForId)
        const result = await deleteDeviceAction(menuForId);
        if (result) {
            setOpenAlertDialog(false);
            history.push({ hash: "" });
        }
    }

    return (
        <Fragment>
            {devices && devices?.length > 0 && (
                <EnchancedTable
                    // @ts-ignore
                    dataProps={[
                        { path: "info.name", label: "Název" },
                        { path: "metadata.deviceId", label: "ID zařízení" },
                        {
                            path: "info.location",
                            label: "Umístění",
                            // @ts-ignore
                            convertor: ({ building, room }) => `${building}/${room}`,
                        },
                        // @ts-ignore
                        {
                            path: "things",
                            label: "Věci",
                            convertor: (things: IThing[]) =>
                                Object.values(things)
                                    .map((obj) => obj.config.name)
                                    .join(", "),
                        },
                        {
                            path: "createdAt",
                            label: "Vytvořeno",
                            convertor: (date: string) => new Date(date).toLocaleDateString(),
                        },
                        {
                            path: "state.status",
                            label: "Status",
                            convertor: (status: IDeviceStatus) => <OnlineCircle status={status} inTransition={false} />,
                        },
                    ]}
                    enableSearch={isWide}
                    data={devices.map((device) => assoc("id", prop("_id", device), device))}
                    toolbarHead="Seznam"
                    orderBy="name"
                    enableEdit
                    customEditButton={(id: string, device: IDevice) => device.permissions.write?.length > 0 ? (
                        <IconButton
                            aria-label="add"
                            size="small"
                            onClick={(e) => handleClick(e, id)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    ) : null}
                    rowsPerPage={10}
                />
            )}

            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <Link to={{ hash: "edit", search: "?id=" + menuForId }}>
                    <MenuItem onClick={handleClose}>Editovat</MenuItem>
                </Link>
                <MenuItem
                    onClick={() => {
                        setCommandField(DeviceCommand.restart)
                        sendDeviceCommandA(menuForId)
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

const _mapStateToProps = (state: any) => {
    const deviceId = getQueryID(state);
    const selectedDevice = getDevices(state).find((dev: IDevice) => dev._id === deviceId);
    return {
        selectedDevice,
        openEditDialog: isUrlHash("#edit")(state),
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            resetEditDeviceAction: formsActions.removeForm("EDIT_DEVICE"),
            prefillEditForm: formsActions.fillForm("EDIT_DEVICE"),
            updateDeviceAction: deviceActions.updateDevice,
            deleteDeviceAction: deviceActions.deleteDevice,
            sendDeviceCommandA: deviceActions.sendCommand,
            setCommandField: formsActions.updateFormField("DEVICE_SEND.command")
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(DiscoverySection);
