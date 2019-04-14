import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends React.Component {
     createSortHandler = property => event => {
          this.props.onRequestSort(event, property);
     };

     render() {
          const { onSelectAllClick, order, orderBy, numSelected, rowCount, rows } = this.props;

          return (
               <TableHead>
                    <TableRow>
                         <TableCell padding="checkbox">
                              <Checkbox
                                   indeterminate={numSelected > 0 && numSelected < rowCount}
                                   checked={numSelected === rowCount}
                                   onChange={onSelectAllClick}
                              />
                         </TableCell>
                         {rows.map(row => {
                              return (
                                   <TableCell
                                        key={row.key}
                                        numeric={row.numeric}
                                        padding={row.disablePadding ? 'none' : 'default'}
                                        sortDirection={orderBy === row.key ? order : false}
                                   >
                                        <Tooltip
                                             title="Sort"
                                             placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                             enterDelay={300}
                                        >
                                             <TableSortLabel
                                                  active={orderBy === row.key}
                                                  direction={order}
                                                  onClick={this.createSortHandler(row.key)}
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
}

EnhancedTableHead.propTypes = {
     numSelected: PropTypes.number.isRequired,
     onRequestSort: PropTypes.func.isRequired,
     onSelectAllClick: PropTypes.func.isRequired,
     order: PropTypes.string.isRequired,
     orderBy: PropTypes.string.isRequired,
     rowCount: PropTypes.number.isRequired
};

export default EnhancedTableHead