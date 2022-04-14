import React, { useEffect } from "react";
import { FormControl, InputAdornment, Stack } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import SetUpSearch from "src/typesenseSearchAdapter";

import Styled from "./Styled";

const Search = ({ lgScreen }) => {
	useEffect(() => {
		SetUpSearch();
	}, []);
	return (
		<Stack
			alignItems="center"
			direction="row"
			sx={theme => ({
				[theme.breakpoints.up("md")]: { marginInline: "auto" },
				[theme.breakpoints.down("md")]: { justifyContent: "center" }
			})}
		>
			<FormControl>
				{lgScreen ? (
					<Styled.SearchInput
						color="secondary"
						placeholder="Search inventory by model, name and more..."
						disableUnderline={true}
						inputProps={{ id: "searchbox" }}
						startAdornment={
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						}
					/>
				) : (
					<Styled.SearchInput
						color="secondary"
						placeholder="Search by model, name and more..."
						smscreen="1"
						inputProps={{ id: "searchbox" }}
						disableUnderline={true}
						sx={{ pl: 1 }}
					/>
				)}
				<div id="hits"></div>
				<div id="pagination"></div>
			</FormControl>
			<Styled.Btn
				search="1"
				color="secondary"
				variant="contained"
				sx={theme => ({ [theme.breakpoints.down("md")]: { minWidth: 54 } })}
			>
				{lgScreen ? "Search Inventory" : <SearchIcon />}
			</Styled.Btn>
		</Stack>
	);
};

export default Search;
