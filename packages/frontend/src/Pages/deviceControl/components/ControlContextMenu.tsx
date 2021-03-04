import React, { useState, Fragment } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";

function ContextMenu({ render, id, name, JSONkey }: any) {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpen = (event: any) => {
		event.preventDefault();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		// e.preventDefault()
		setAnchorEl(null);
	};

	return (
		<Fragment>
			{render({ handleOpen, handleClose })}
			<Menu
				id="control-contex-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<Link to={{ pathname: `/deviceControl/${id}`, search: `?JSONkey=${JSONkey}` }}>
					<MenuItem onClick={handleClose}>Historie</MenuItem>
				</Link>
				<Link to={{ search: `?id=${id}&JSONkey=${JSONkey}`, hash: "editNotify" }}>
					<MenuItem onClick={handleClose}>Notifikace</MenuItem>
				</Link>
			</Menu>
		</Fragment>
	);
}

export default ContextMenu;
