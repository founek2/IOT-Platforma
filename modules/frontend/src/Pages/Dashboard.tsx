import { Card, CardContent, CardHeader, CircularProgress, Grid } from "@mui/material"
import React from "react"
import DataList from "../components/DataList";
import PlotifyGauge from "../components/PlotifyGauge";
import { BrokerConnectionItem, BrokerData, useBrokerQuery } from "../endpoints/broker"
import { useDevicesAllQuery, useDevicesQuery } from "../endpoints/devices";


enum ConnectionType {
    user, device, guest
}
type ItemExtended = BrokerConnectionItem & { _id: string, type: ConnectionType }

function detectConnectionType(item: BrokerConnectionItem) {
    const user = item.user;
    if (user.startsWith("guest="))
        return ConnectionType.guest;
    if (user.startsWith("device="))
        return ConnectionType.device;

    return ConnectionType.user;
}

function extractHumanText(item: ItemExtended) {
    const user = item.user;
    const userSplitted = user.split("=");

    if (item.type == ConnectionType.guest)
        return `Čeká na připojení ${userSplitted[1]}`
    if (item.type == ConnectionType.device)
        return `Zařízení ${userSplitted[1]}`
    if (item.type == ConnectionType.user)
        return `Uživatel ${user}`

    return `Neznámé spojení`
}

function sortByName(a: BrokerConnectionItem, b: BrokerConnectionItem,) {
    return a.user.localeCompare(b.user)
}

export default function Dashboard() {
    const { data, isLoading } = useBrokerQuery()
    const { data: devices, isLoading: isLoadingDevices } = useDevicesAllQuery()

    if (isLoading || isLoadingDevices) return <CircularProgress />;

    const dataWithId = data?.connections.items.map(item => ({ _id: item.name, ...item, type: detectConnectionType(item) }));
    dataWithId?.sort(sortByName)
    const dataPaired = dataWithId?.filter(item => item.type == ConnectionType.device);

    return <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={7} lg={6} xl={3}>
            <Card sx={{ padding: 2 }}>
                <CardHeader title="Aktivní spojení" />
                <CardContent>
                    <DataList data={dataWithId || []} getHumanText={extractHumanText} />
                </CardContent>
            </Card>
        </Grid>

        <Grid item xs={12} md={7} lg={6} xl={3}>
            <Card sx={{ padding: 2 }}>
                <CardHeader title="Aktivní spojení" />
                <CardContent>
                    <PlotifyGauge value={dataPaired?.length} maxValue={devices?.docs.length} />
                </CardContent>
            </Card>
        </Grid>
    </Grid>

}