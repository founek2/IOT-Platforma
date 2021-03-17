import { Fab, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "framework-ui/lib/Components/Dialog";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import EnchancedTable from "framework-ui/lib/Components/Table";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { isUrlHash } from "framework-ui/lib/utils/getters";
import { assoc, prop } from "ramda";
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as discoveredActions from "../../store/actions/application/discovery";
import { getDiscovery } from "../../utils/getters";
import OnlineCircle from "../../components/OnlineCircle";
import type { DeviceStatus } from "common/lib/models/interface/device";
import { IDiscovery, IDiscoveryThing } from "common/lib/models/interface/discovery";

interface DiscoverySectionProps {
	discoveredDevices?: IDiscovery[];
	resetCreateDeviceAction: any;
	deleteDiscoveryAction: any;
	updateFormField: any;
	addDiscoveryAction: any;
}

function DiscoverySection(props: DiscoverySectionProps) {
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const {
		discoveredDevices,
		resetCreateDeviceAction,
		deleteDiscoveryAction,
		updateFormField,
		addDiscoveryAction,
	} = props;

	function closeDialog() {
		resetCreateDeviceAction();
		setOpenAddDialog(false);
	}

	return (
		<Fragment>
			{discoveredDevices && discoveredDevices?.length > 0 && (
				<FieldConnector
					deepPath="DISCOVERY_DEVICES.selected"
					component={({ onChange, value }) => (
						<EnchancedTable
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
							customEditButton={(id: string) => (
								<Fab
									color="primary"
									aria-label="add"
									size="small"
									onClick={() => {
										updateFormField("CREATE_DEVICE._id", id);
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
							rowsPerPage={2}
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
				onAgree={async () => {
					await addDiscoveryAction();
					closeDialog();
				}}
				onClose={closeDialog}
				content={
					<Grid container spacing={2}>
						<Grid item md={12}>
							<FieldConnector deepPath="CREATE_DEVICE.info.name" fieldProps={{ fullWidth: true }} />
						</Grid>
						<Grid item md={4}>
							<FieldConnector deepPath="CREATE_DEVICE.info.location.building" />
						</Grid>
						<Grid item md={4}>
							<FieldConnector deepPath="CREATE_DEVICE.info.location.room" />
						</Grid>
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
			fetchDiscoveredDevicesAction: discoveredActions.fetch,
			deleteDiscoveryAction: discoveredActions.deleteDevices,
			addDiscoveryAction: discoveredActions.addDevice,
			resetCreateDeviceAction: formsActions.removeForm("CREATE_DEVICE"),
			updateFormField: formsActions.updateFormField,
		},
		dispatch
	);

export default connect(_mapStateToProps, _mapDispatchToProps)(DiscoverySection);
