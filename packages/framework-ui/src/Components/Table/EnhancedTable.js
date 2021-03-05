import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import { equals } from "ramda";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import getInPath from "../../utils/getInPath";

function desc(a, b, orderBy) {
	if (getInPath(orderBy, b) < getInPath(orderBy, a)) {
		return -1;
	}
	if (getInPath(orderBy, b) > getInPath(orderBy, a)) {
		return 1;
	}
	return 0;
}

function getSorting(order, orderBy) {
	return order === "desc" ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function mustContain(searchText, dataProps) {
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

const styles = (theme) => ({
	root: {
		width: "100%",
		marginTop: theme.spacing(3),
	},
	table: {
		// minWidth: 1020
	},
	tableWrapper: {
		overflowX: "auto",
	},
	editCell: {
		width: 50,
	},
	createdCell: {
		width: 200,
	},
});

class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			order: props.order,
			orderBy: props.orderBy,
			data: [...props.data],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			searchText: "",
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!equals(this.state.data, nextProps.data)) {
			this.setState({ data: [...nextProps.data] });
		}
	}

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = "desc";

		if (this.state.orderBy === property && this.state.order === "desc") {
			order = "asc";
		}

		this.setState({ order, orderBy });
	};

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			// this.setState(state => ({ selected: state.data.map(n => n.id) }));
			const newSelected = this.state.data.map((n) => n.id);
			this.changeSelected(newSelected);
			return;
		}
		this.changeSelected([]);
	};

	handleClick = (event, id) => {
		const selected = this.props.value ? this.props.value : []; // ignore
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

	changeSelected = (newSelected) => {
		const { onChange } = this.props;
		onChange({ target: { value: newSelected } });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	isSelected = (id) => this.props.value.indexOf(id) !== -1;

	handleDelete = (e) => {
		this.props.onDelete(e);
		this.handleSelectAllClick();
	};

	handleSearchChange = (e) => {
		console.log(e.target.value);
		this.setState({
			searchText: e.target.value,
		});
	};

	render() {
		const {
			classes,
			dataProps,
			toolbarHead,
			onAdd,
			enableCreation,
			enableEdit,
			onEdit,
			enableSearch,
			customEditButton,
		} = this.props;
		const selected = this.props.value;
		const { data, order, orderBy, rowsPerPage, page, searchText } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<div className={classes.root}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					headLabel={toolbarHead}
					onDelete={this.handleDelete}
					onAdd={onAdd}
					enableCreation={enableCreation}
					enableSearch={enableSearch}
					onSearchChange={this.handleSearchChange}
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
								.filter(mustContain(searchText, dataProps))
								.sort(getSorting(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((n) => {
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
												<Checkbox
													checked={isSelected}
													onClick={(event) => this.handleClick(event, n.id)}
												/>
											</TableCell>
											{dataProps.map(({ path, convertor, align }, i) => (
												<TableCell
													key={path}
													className={path === "created" ? classes.createdCell : ""}
													align={align}
												>
													{convertor ? convertor(getInPath(path, n)) : getInPath(path, n)}
												</TableCell>
											))}
											<TableCell className={classes.editCell}>
												{enableEdit &&
													(!customEditButton ? (
														<IconButton
															// color="primary"
															aria-label="Edit"
															size="small"
															onClick={() => onEdit(n.id)}
														>
															<EditIcon />
														</IconButton>
													) : (
														customEditButton(n.id)
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
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						"aria-label": "Předchozí stránka",
					}}
					nextIconButtonProps={{
						"aria-label": "Další stránka",
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
	rowsPerPage: 5,
	value: [],
	order: "asc",
};

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
