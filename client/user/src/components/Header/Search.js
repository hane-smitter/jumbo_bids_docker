import React, { useRef, useState } from "react";
import {
	FormControl,
	InputAdornment,
	Stack,
	Box,
	Typography
} from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";
import { searchClient } from "src/typesenseSearchAdapter";
import {
	InstantSearch,
	Hits,
	// SearchBox,
	Configure,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList,
	connectSearchBox
} from "react-instantsearch-dom";

import Styled from "./Styled";

function mySearchBox(props) {
	return (
		<Box sx={{ width: "100%", p: 1, display: "grid", justifyItems: "center" }}>
			<form
				noValidate
				role="search"
				// style={{ width: "100%", marginInline: "auto" }}
			>
				<Styled.SearchInput
					color="secondary"
					placeholder="Search by model, name and more..."
					value={props.currentRefinement}
					onChange={e => props.refine(e.currentTarget.value)}
					// smscreen="1"
					disableUnderline={true}
					sx={{ pl: 1 }}
				/>
			</form>
		</Box>
	);
}

const CustomSearchBox = connectSearchBox(mySearchBox);

function Hit(props) {
	return (
		<div style={{ color: "#333" }}>
			<img src={props.hit.image} height={40} alt={props.hit.name} />
			<div className="hit-name">
				<Highlight attribute="name" hit={props.hit} />
			</div>
			<div className="hit-category">
				<Highlight attribute="category" hit={props.hit} />
			</div>
			<div className="hit-description">
				<Highlight attribute="cat_desc" hit={props.hit} />
			</div>
			<div className="hit-price">Bid @ Ksh.{props.hit.bidPrice}</div>
		</div>
	);
}

const Search = ({ lgScreen }) => {
	const [triggerSearch, setTriggerSearch] = useState(false);
	const searchInpPointer = useRef(null);

	const onSearchInputClick = () => {
		setTriggerSearch(prev => !prev);
		console.log("searchInpPointer", searchInpPointer);
		searchInpPointer?.current?.blur();
	};
	const onCloseSearchBoard = () => {
		setTriggerSearch(false);
	};
	// useEffect(() => {
	// 	SetUpSearch();
	// }, []);
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
						ref={searchInpPointer}
						onClick={onSearchInputClick}
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
						disableUnderline={true}
						ref={searchInpPointer}
						sx={{ pl: 1 }}
						onClick={onSearchInputClick}
					/>
				)}
			</FormControl>
			<InstantSearch indexName="biddable_products" searchClient={searchClient}>
				{triggerSearch && (
					<Styled.SearchBoard>
						<Styled.SearchUtilsCont>
							<Box sx={{ alignSelf: "start", width: "100%" }}>
								<Box
									sx={{ p: 1 }}
									component="span"
									onClick={onCloseSearchBoard}
									sx={{ cursor: "pointer" }}
								>
									<ClearIcon />
								</Box>
							</Box>
							<Box sx={{ display: "flex", width: "100%", alignItems: "start" }}>
								<Styled.SearchLeftPane>
									<ClearRefinements />
									<Typography variant="h4" gutterBottom>
										Categories
									</Typography>
									<RefinementList attribute="category" />
								</Styled.SearchLeftPane>
								<Styled.SearchRightPane>
									<CustomSearchBox />
									{/* <SearchBox /> */}

									<Hits hitComponent={Hit} />
									<Configure hitsPerPage={8} />
									<Pagination />
								</Styled.SearchRightPane>
							</Box>
						</Styled.SearchUtilsCont>
					</Styled.SearchBoard>
				)}
			</InstantSearch>
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
