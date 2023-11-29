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
    // "sample_retention_policies": {
    //   "global": [
    //     600,
    //     3600,
    //     28800,
    //     86400
    //   ],
    //   "basic": [
    //     600,
    //     3600
    //   ],
    //   "detailed": [
    //     600
    //   ]
    // },
    // "exchange_types": [
    //   {
    //     "name": "direct",
    //     "description": "AMQP direct exchange, as per the AMQP specification",
    //     "enabled": true
    //   },
    //   {
    //     "name": "fanout",
    //     "description": "AMQP fanout exchange, as per the AMQP specification",
    //     "enabled": true
    //   },
    //   {
    //     "name": "headers",
    //     "description": "AMQP headers exchange, as per the AMQP specification",
    //     "enabled": true
    //   },
    //   {
    //     "name": "topic",
    //     "description": "AMQP topic exchange, as per the AMQP specification",
    //     "enabled": true
    //   }
    // ],
    product_version: string;
    product_name: string;
    rabbitmq_version: string;
    cluster_name: string;
    // "erlang_version": "24.0.2",
    // "erlang_full_version": "Erlang/OTP 24 [erts-12.0.2] [source] [64-bit] [smp:12:12] [ds:12:12:10] [async-threads:1] [jit]",
    // "disable_stats": false,
    // "enable_queue_totals": false,
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
    // "statistics_db_event_queue": 0,
    node: string;
    // "listeners": [
    //   {
    //     "node": "rabbit@martas-ubuntu",
    //     "protocol": "amqp",
    //     "ip_address": "127.0.0.1",
    //     "port": 5672,
    //     "socket_opts": {
    //       "backlog": 128,
    //       "nodelay": true,
    //       "linger": [
    //         true,
    //         0
    //       ],
    //       "exit_on_close": false
    //     }
    //   },
    //   {
    //     "node": "rabbit@martas-ubuntu",
    //     "protocol": "clustering",
    //     "ip_address": "::",
    //     "port": 25672,
    //     "socket_opts": []
    //   },
    //   {
    //     "node": "rabbit@martas-ubuntu",
    //     "protocol": "http",
    //     "ip_address": "::",
    //     "port": 15672,
    //     "socket_opts": {
    //       "cowboy_opts": {
    //         "sendfile": false
    //       },
    //       "port": 15672
    //     }
    //   },
    //   {
    //     "node": "rabbit@martas-ubuntu",
    //     "protocol": "mqtt",
    //     "ip_address": "::",
    //     "port": 1883,
    //     "socket_opts": {
    //       "backlog": 128,
    //       "nodelay": true
    //     }
    //   },
    //   {
    //     "node": "rabbit@martas-ubuntu",
    //     "protocol": "mqtt/ssl",
    //     "ip_address": "::",
    //     "port": 8883,
    //     "socket_opts": {
    //       "backlog": 128,
    //       "nodelay": true,
    //       "versions": [
    //         "tlsv1.3",
    //         "tlsv1.2",
    //         "tlsv1.1",
    //         "tlsv1"
    //       ],
    //       "cacertfile": "/home/martas/Work/keys/mqtt/ca_certificate.pem",
    //       "certfile": "/home/martas/Work/keys/mqtt/server_certificate.pem",
    //       "keyfile": "/home/martas/Work/keys/mqtt/server_key.pem",
    //       "verify": "verify_none",
    //       "fail_if_no_peer_cert": false
    //     }
    //   }
    // ],
    // "contexts": [
    //   {
    //     "ssl_opts": [],
    //     "node": "rabbit@martas-ubuntu",
    //     "description": "RabbitMQ Management",
    //     "path": "/",
    //     "cowboy_opts": "[{sendfile,false}]",
    //     "port": "15672"
    //   }
    // ]
};
