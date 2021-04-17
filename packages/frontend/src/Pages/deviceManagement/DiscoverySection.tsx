import { Fab, Grid, useTheme, useMediaQuery } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { DeviceStatus } from "common/lib/models/interface/device";
import { IDiscovery, IDiscoveryThing } from "common/lib/models/interface/discovery";
import Dialog from "framework-ui/lib/Components/Dialog";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import EnchancedTable from "framework-ui/lib/Components/Table";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { isUrlHash } from "framework-ui/lib/utils/getters";
import { DeviceForm } from "frontend/src/components/DeviceForm";
import { assoc, prop } from "ramda";
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import OnlineCircle from "../../components/OnlineCircle";
import * as discoveredActions from "../../store/actions/application/discovery";
import { useManagementStyles } from "frontend/src/hooks/useManagementStyles";


interface DiscoverySectionProps {
    discoveredDevices?: IDiscovery[];
    resetCreateDeviceAction: any;
    deleteDiscoveryAction: any;
    updateFormField: any;
    addDiscoveryAction: any;
}

function DiscoverySection(props: DiscoverySectionProps) {
    const classes = useManagementStyles()
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<null | string>(null);
    const {
        discoveredDevices,
        resetCreateDeviceAction,
        deleteDiscoveryAction,
        updateFormField,
        addDiscoveryAction,
    } = props;
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("xs"));

    function closeDialog() {
        resetCreateDeviceAction();
        setOpenAddDialog(false);
    }

    async function onAgree() {
        const result = await addDiscoveryAction(selectedId);
        if (result) closeDialog();
    }

    return (
        <Fragment >
            {discoveredDevices && discoveredDevices?.length > 0 && (
                <FieldConnector
                    deepPath="DISCOVERY_DEVICES.selected"
                    component={({ onChange, value }) => (
                        <EnchancedTable
                            customClasses={{
                                tableWrapper: classes.tableWrapper,
                                toolbar: classes.toolbar,
                                pagination: classes.pagination,
                            }}
                            rowsPerPageOptions={[2, 5, 10, 25]}
                            rowsPerPage={2}
                            // @ts-ignore
                            dataProps={[
                                { path: "name", label: "Název" },
                                { path: "deviceId", label: "ID zařízení" },
                                {
                                    path: "things",
                                    label: "Věcí",
                                    convertor: (things: { [nodeId: string]: IDiscoveryThing }) =>
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
                                    convertor: (status: { value: DeviceStatus; timestamp: Date }) => (
                                        <OnlineCircle status={status} inTransition={false} />
                                    ),
                                },
                            ]}
                            data={discoveredDevices.map((device: any) => assoc("id", prop("_id", device), device))}
                            toolbarHead="Přidání zařízení"
                            onDelete={deleteDiscoveryAction}
                            orderBy="Název"
                            // enableCreation={isAdmin}
                            //onAdd={() => this.updateCreateForm({ open: true })}
                            enableEdit
                            customEditButton={(id: string, item: IDiscovery) =>
                                (
                                    <Fab
                                        color="primary"
                                        aria-label="add"
                                        size="small"
                                        disabled={item.state?.status.value !== DeviceStatus.ready}
                                        onClick={() => {
                                            setSelectedId(id);
                                            console.log("looking", discoveredDevices, id);
                                            updateFormField(
                                                "CREATE_DEVICE.info.name",
                                                discoveredDevices.find((dev) => dev._id === id)?.name || ""
                                            );
                                            setOpenAddDialog(true);
                                        }}
                                    >
                                        <AddIcon />
                                    </Fab>
                                )}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
            )}
            <Dialog
                open={openAddDialog}
                title="Přidání zařízení"
                cancelText="Zrušit"
                agreeText="Přidat"
                onAgree={onAgree}
                onClose={closeDialog}
                fullScreen={isSmall}
                content={
                    <Grid container spacing={2}>
                        <DeviceForm formName="CREATE_DEVICE" onEnter={onAgree} />
                    </Grid>
                }
            />
        </Fragment>
    );
}

const _mapStateToProps = (state: any) => {
    return {
        openAddDialog: isUrlHash("#addDevice")(state),
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            deleteDiscoveryAction: discoveredActions.deleteDevices,
            addDiscoveryAction: discoveredActions.addDevice,
            resetCreateDeviceAction: formsActions.removeForm("CREATE_DEVICE"),
            updateFormField: formsActions.updateFormField,
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(DiscoverySection);
