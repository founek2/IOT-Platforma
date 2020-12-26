export interface ControlProps {
    name: string
    description: string
    onClick: React.ChangeEvent<any>
    data: any
    ackTime: Date
    afk: boolean
    pending: boolean
    forceUpdate: React.ChangeEventHandler
}