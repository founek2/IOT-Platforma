import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead, { DataProp } from './EnhancedTableHead';
import { equals, when } from 'ramda';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import getInPath from '../../utils/getInPath';
import clsx from 'clsx';
import isNotNil from '../../utils/isNotNil';

function desc(a: any, b: any, orderBy: string) {
    if (getInPath(orderBy, b) < getInPath(orderBy, a)) {
        return -1;
    }
    if (getInPath(orderBy, b) > getInPath(orderBy, a)) {
        return 1;
    }
    return 0;
}

function getSorting(order: 'asc' | 'desc', orderBy: string) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function mustContain(searchText: string, dataProps: DataProp[]) {
    return (obj) => {
        for (const { path, convertor } of dataProps) {
            const value = convertor ? convertor(getInPath(path, obj)) : getInPath(path, obj);
            if (value && String(value).includes(searchText)) {
                return true;
            }
        }

        return false;
    };
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    editCell: {
        width: 50,
    },
    createdCell: {
        width: 200,
    },
});

interface EnhancedTableProps<T extends { _id: any }> {
    order?: 'asc' | 'desc';
    orderBy: string;
    data: T[];
    rowsPerPage?: number;
    value?: any[];
    onChange?: (value: { target: { value: any[] } }) => any;
    onDelete?: (value: any[]) => any;
    onAdd?: (e: any) => any;
    onEdit?: (id: any) => any;
    dataProps: DataProp[];
    toolbarHead: string;
    enableCreation?: boolean;
    enableEdit?: boolean;
    enableSearch?: boolean;
    customClasses?: {
        toolbar?: string;
        tableWrapper?: string;
        pagination?: string;
    };
    rowsPerPageOptions?: number[];
    customEditButton?: (id: any, item: any) => JSX.Element | null | JSX.Element[];
}
function EnhancedTable<T extends { _id: string }>({
    dataProps,
    data,
    toolbarHead,
    onAdd,
    enableCreation,
    enableEdit,
    onEdit,
    enableSearch,
    customEditButton,
    onDelete,
    rowsPerPageOptions = [10, 25, 50],
    customClasses = {},
    value = [],
    onChange,
    orderBy,
}: EnhancedTableProps<T>) {
    const classes = useStyles();
    const [orderState, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderByState, setOrderBy] = useState<string>(orderBy);
    const [pageState, setPage] = useState(0);
    const [rowsPerPageState, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>('');

    // componentWillReceiveProps(nextProps) {
    //     if (!equals(this.state.data, nextProps.data)) {
    //         this.setState({ data: [...nextProps.data] });
    //     }
    // }

    function handleRequestSort(event: any, property: string) {
        if (orderByState === property) {
            setOrder(orderState === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderBy(property);
        }
        console.log('handle', property, orderByState);
    }

    function handleSelectAllClick(event: any, checked: boolean) {
        if (checked) {
            // this.setState(state => ({ selected: state.data.map(n => n.id) }));
            const newSelected = this.state.data.map((n) => n.id);
            changeSelected(newSelected);
        } else changeSelected([]);
    }

    function handleClick(event: any, id: string) {
        const selected = value ? value : []; // ignore
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        changeSelected(newSelected);
    }

    function changeSelected(newSelected: string[]) {
        if (onChange) onChange({ target: { value: newSelected } });
    }

    function handleChangePage(event: any, page: number) {
        setPage(page);
    }

    function handleChangeRowsPerPage(event: any) {
        setRowsPerPage(event.target.value);
    }

    function isSelectedFn(id: string) {
        return value.indexOf(id) !== -1;
    }

    function handleDelete(e) {
        onDelete(value);
        handleSelectAllClick(null, false);
    }

    function handleSearchChange(e) {
        setSearchText(e.target.value);
    }

    const enableSelection = Boolean(onDelete);
    const selected = value;
    // const { data, order, orderBy, rowsPerPage, page, searchText } = this.state;
    const emptyRows = rowsPerPageState - Math.min(rowsPerPageState, data.length - pageState * rowsPerPageState);

    return (
        <div className={classes.root}>
            <EnhancedTableToolbar
                numSelected={selected.length}
                headLabel={toolbarHead}
                onDelete={handleDelete}
                onAdd={onAdd}
                enableCreation={enableCreation}
                enableSearch={enableSearch}
                onSearchChange={handleSearchChange}
                className={customClasses.toolbar}
            />
            <div className={clsx(classes.tableWrapper, customClasses.tableWrapper)}>
                <Table aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={orderState}
                        orderBy={orderByState}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={data.length}
                        rows={dataProps}
                        enableSelection={enableSelection}
                    />
                    <TableBody>
                        {data
                            .filter(mustContain(searchText, dataProps))
                            .sort(getSorting(orderState, orderByState))
                            .slice(pageState * rowsPerPageState, pageState * rowsPerPageState + rowsPerPageState)
                            .map((n) => {
                                const isSelected = isSelectedFn(n._id);
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        key={n._id}
                                        selected={isSelected}
                                    >
                                        {enableSelection && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onClick={(event) => handleClick(event, n._id)}
                                                />
                                            </TableCell>
                                        )}
                                        {dataProps.map(({ path, convertor, align }, i) => (
                                            <TableCell
                                                key={path}
                                                className={path === 'created' ? classes.createdCell : ''}
                                                align={align}
                                            >
                                                {/* @ts-ignore */}
                                                {when(() => isNotNil(convertor), convertor)(getInPath(path, n))}
                                                {/* {convertor ? convertor(getInPath(path, n)) : getInPath(path, n)} */}
                                            </TableCell>
                                        ))}
                                        <TableCell className={classes.editCell}>
                                            {enableEdit &&
                                                (!customEditButton ? (
                                                    <IconButton
                                                        // color="primary"
                                                        aria-label="Edit"
                                                        size="small"
                                                        onClick={() => onEdit(n._id)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                ) : (
                                                    customEditButton(n._id, n)
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 49 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                className={customClasses.pagination}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPageState}
                rowsPerPageOptions={rowsPerPageOptions}
                page={pageState}
                backIconButtonProps={{
                    'aria-label': 'Předchozí stránka',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Další stránka',
                }}
                labelRowsPerPage="Položek na stránku"
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
            />
        </div>
    );
}

export default EnhancedTable;
