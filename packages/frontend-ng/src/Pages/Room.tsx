import React from 'react';
import Room from './room/Room';

export interface RoomProps {
    title?: string;
}
export default function RoomPage({ title }: RoomProps) {
    return <Room title={title} mode="things" />;
}
