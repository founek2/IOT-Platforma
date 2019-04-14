import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import { equals } from 'ramda';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab'

function desc(a, b, orderBy) {
     if (b[orderBy] < a[orderBy]) {
          return -1;
     }
     if (b[orderBy] > a[orderBy]) {
          return 1;
     }
     return 0;
}

function getSorting(order, orderBy) {
     return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
     root: {
          width: '100%',
          marginTop: theme.spacing.unit * 3
     },
     table: {
          minWidth: 1020
     },
     tableWrapper: {
          overflowX: 'auto'
     },
     editCell: {
          width: 50
	},
	createdCell: {
		width: 200
	}
});

class EnhancedTable extends React.Component {
     constructor(props) {
		super(props);
          this.state = {
               order: 'asc',
               orderBy: props.orderBy,
               selected: [],
               data: [...props.data],
               page: 0,
               rowsPerPage: props.rowsPerPage,
          };
     }

     componentWillReceiveProps(nextProps) {
          if (!equals(this.state.data, nextProps.data)) {
               this.setState({ data: [...nextProps.data] });
          }
     }

     handleRequestSort = (event, property) => {
          const orderBy = property;
          let order = 'desc';

          if (this.state.orderBy === property && this.state.order === 'desc') {
               order = 'asc';
          }

          this.setState({ order, orderBy });
     };

     handleSelectAllClick = (event, checked) => {
          if (checked) {
               // this.setState(state => ({ selected: state.data.map(n => n.id) }));
               const newSelected = this.state.data.map(n => n.id);
               this.changeSelected(newSelected);
               return;
          }
          this.changeSelected([]);
     };

     handleClick = (event, id) => {
          const { selected } = this.state;
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

          this.changeSelected(newSelected);
     };

     changeSelected = newSelected => {
          const { onChange } = this.props;
          this.setState({ selected: newSelected });
          if (onChange) onChange({ target: { value: newSelected } });
     };

     handleChangePage = (event, page) => {
          this.setState({ page });
     };

     handleChangeRowsPerPage = event => {
          this.setState({ rowsPerPage: event.target.value });
     };

     isSelected = id => this.state.selected.indexOf(id) !== -1;

     handleDelete = e => {
          this.props.onDelete(e);
          this.handleSelectAllClick();
     };

     render() {
          const { classes, dataProps, toolbarHead, onAdd, enableCreation, enableEdit, onEdit } = this.props;
          const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
          const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

          return (
               <div className={classes.root}>
                    <EnhancedTableToolbar
                         numSelected={selected.length}
                         headLabel={toolbarHead}
                         onDelete={this.handleDelete}
                         onAdd={onAdd}
                         enableCreation={enableCreation}
                    />
                    <div className={classes.tableWrapper}>
                         <Table className={classes.table} aria-labelledby="tableTitle">
                              <EnhancedTableHead
                                   numSelected={selected.length}
                                   order={order}
                                   orderBy={orderBy}
                                   onSelectAllClick={this.handleSelectAllClick}
                                   onRequestSort={this.handleRequestSort}
                                   rowCount={data.length}
                                   rows={dataProps}
                              />
                              <TableBody>
                                   {data
                                        .sort(getSorting(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map(n => {
                                             const isSelected = this.isSelected(n.id);
                                             return (
                                                  <TableRow
                                                       hover
                                                       role="checkbox"
                                                       aria-checked={isSelected}
                                                       tabIndex={-1}
                                                       key={n.id}
                                                       selected={isSelected}
                                                  >
                                                       <TableCell padding="checkbox">
                                                            <Checkbox checked={isSelected} onClick={event => this.handleClick(event, n.id)}/>
                                                       </TableCell>
                                                       {dataProps.map(({ key, convertor }, i) => (
                                                            <TableCell key={key} className={key === "created" ? classes.createdCell : ""}>
                                                                 {convertor ? convertor(n[key]) : n[key]}
                                                            </TableCell>
                                                       ))}
                                                       <TableCell className={classes.editCell}>
                                                            {enableEdit && (
                                                                 <Fab
                                                                      color="primary"
                                                                      aria-label="Add"
                                                                      size="small"
                                                                      onClick={() => onEdit(n.id)}
                                                                 >
                                                                      <EditIcon />
                                                                 </Fab>
                                                            )}
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
                         component="div"
                         count={data.length}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         backIconButtonProps={{
                              'aria-label': 'Předchozí stránka'
                         }}
                         nextIconButtonProps={{
                              'aria-label': 'Další stránka'
                         }}
                         labelRowsPerPage="Položek na stránku"
                         onChangePage={this.handleChangePage}
                         onChangeRowsPerPage={this.handleChangeRowsPerPage}
                         labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
                    />
               </div>
          );
     }
}

EnhancedTable.defaultProps = {
	rowsPerPage: 5
}

EnhancedTable.propTypes = {
     classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
