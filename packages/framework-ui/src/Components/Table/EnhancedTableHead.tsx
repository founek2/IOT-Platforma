import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

export type DataProp = {
    path: string;
    label: string;
    numeric?: boolean;
    disablePadding?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify';
    convertor?: (value: any) => string | JSX.Element | JSX.Element[];
};

interface EnhancedTableHeadProps {
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    order: 'asc' | 'desc';
    orderBy: any;
    numSelected: number;
    rowCount: number;
    onRequestSort: (event: any, property: any) => void;
    enableSelection: boolean;
    rows: DataProp[];
}
function EnhancedTableHead({
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    rows,
    enableSelection,
    onRequestSort,
}: EnhancedTableHeadProps) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {enableSelection && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                )}
                {rows.map((row) => {
                    return (
                        <TableCell
                            key={row.path}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.path ? order : false}
                            align={row.align}
                        >
                            <Tooltip
                                title="Sort"
                                placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                enterDelay={300}
                            >
                                <TableSortLabel
                                    active={orderBy === row.path}
                                    direction={order}
                                    onClick={createSortHandler(row.path)}
                                >
                                    {row.label}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

export default EnhancedTableHead;
