export type ConnectionsPage = {
    total_count: number;
    item_count: number;
    filtered_count: number;
    page: number;
    page_size: number;
    page_count: number;
    items: [
        {
            channel_max: number;
            channels: number;
            client_properties: {
                client_id: string;
                product: string;
            };
            connected_at: number;
            frame_max: number;
            // garbage_collection: {
            //     fullsweep_after: 65535;
            //     max_heap_size: 0;
            //     min_bin_vheap_size: 46422;
            //     min_heap_size: 233;
            //     minor_gcs: 11238;
            // };
            // host: '127.0.0.1';
            host: string;
            // name: '127.0.0.1:43638 -> 127.0.0.1:8884';
            name: string;
            // node: 'test@web';
            node: string;
            // peer_host: '127.0.0.1';
            peer_host: string;
            peer_port: number;
            port: number;
            // protocol: 'MQTT 3.1.1';
            protocol: string;
            // recv_cnt: 7265;
            // recv_oct: 177026;
            // recv_oct_details: {
            //     rate: 0.0;
            // };
            // reductions: 42593753;
            // reductions_details: {
            //     rate: 91.8;
            // };
            // send_cnt: 10341;
            // send_oct: 375352;
            // send_oct_details: {
            //     rate: 0.0;
            // };
            // send_pend: 0;
            ssl: boolean;
            ssl_cipher: string;
            ssl_hash: string;
            // ssl_key_exchange: 'any';
            ssl_protocol: string;
            // state: 'running';
            state: string;
            type: string;
            user: string;
            user_who_performed_action: string;
            variable_map: {
                client_id: string;
            };
            vhost: string;
        }
    ];
};

export type VHost = {
    cluster_state: {
        // 'test@web': 'running';
        'test@web': string;
    };
    description: 'Default virtual host';
    message_stats: {
        ack: number;
        ack_details: {
            rate: number;
        };
        confirm: number;
        confirm_details: {
            rate: number;
        };
        deliver: number;
        deliver_details: {
            rate: number;
        };
        deliver_get: number;
        deliver_get_details: {
            rate: number;
        };
        deliver_no_ack: number;
        deliver_no_ack_details: {
            rate: number;
        };
        drop_unroutable: number;
        drop_unroutable_details: {
            rate: number;
        };
        get: number;
        get_details: {
            rate: number;
        };
        get_empty: number;
        get_empty_details: {
            rate: number;
        };
        get_no_ack: number;
        get_no_ack_details: {
            rate: number;
        };
        publish: number;
        publish_details: {
            rate: number;
        };
        redeliver: number;
        redeliver_details: {
            rate: number;
        };
        return_unroutable: number;
        return_unroutable_details: {
            rate: number;
        };
    };
    messages: number;
    messages_details: {
        rate: number;
    };
    messages_ready: number;
    messages_ready_details: {
        rate: number;
    };
    messages_unacknowledged: number;
    messages_unacknowledged_details: {
        rate: number;
    };
    metadata: {
        description: string;
        tags: [];
    };
    name: string;
    recv_oct: number;
    recv_oct_details: {
        rate: number;
    };
    send_oct: number;
    send_oct_details: {
        rate: number;
    };
    tags: [];
    tracing: false;
};

export type OverView = {
    management_version: string;
    rates_mode: string;
    product_version: string;
    product_name: string;
    rabbitmq_version: string;
    cluster_name: string;
    message_stats: {
        ack: number;
        ack_details: {
            rate: number;
        };
        confirm: 2;
        confirm_details: {
            rate: number;
        };
        deliver: number;
        deliver_details: {
            rate: number;
        };
        deliver_get: number;
        deliver_get_details: {
            rate: number;
        };
        deliver_no_ack: number;
        deliver_no_ack_details: {
            rate: number;
        };
        disk_reads: number;
        disk_reads_details: {
            rate: number;
        };
        disk_writes: number;
        disk_writes_details: {
            rate: number;
        };
        drop_unroutable: number;
        drop_unroutable_details: {
            rate: number;
        };
        get: number;
        get_details: {
            rate: number;
        };
        get_empty: number;
        get_empty_details: {
            rate: number;
        };
        get_no_ack: number;
        get_no_ack_details: {
            rate: number;
        };
        publish: number;
        publish_details: {
            rate: number;
        };
        redeliver: number;
        redeliver_details: {
            rate: number;
        };
        return_unroutable: number;
        return_unroutable_details: {
            rate: number;
        };
    };
    churn_rates: {
        channel_closed: number;
        channel_closed_details: {
            rate: number;
        };
        channel_created: number;
        channel_created_details: {
            rate: number;
        };
        connection_closed: number;
        connection_closed_details: {
            rate: number;
        };
        connection_created: number;
        connection_created_details: {
            rate: number;
        };
        queue_created: number;
        queue_created_details: {
            rate: number;
        };
        queue_declared: number;
        queue_declared_details: {
            rate: number;
        };
        queue_deleted: number;
        queue_deleted_details: {
            rate: number;
        };
    };
    queue_totals: {
        messages: number;
        messages_details: {
            rate: number;
        };
        messages_ready: number;
        messages_ready_details: {
            rate: number;
        };
        messages_unacknowledged: number;
        messages_unacknowledged_details: {
            rate: number;
        };
    };
    object_totals: {
        channels: number;
        connections: number;
        consumers: number;
        exchanges: number;
        queues: number;
    };
    node: string;
};

export type Connections = {
    total_count: number
    item_count: number
    items: {
        name: string //"10.10.5.7:47002 -> 10.10.5.5:15675"
        vhost: string
        user: string
        node: string
    }[]
}