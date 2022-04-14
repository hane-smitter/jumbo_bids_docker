import React, { useRef, useState } from "react";
import { FormControl, InputAdornment, Stack, Box } from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";
import { searchClient } from "src/typesenseSearchAdapter";

import Styled from "./Styled";
import {
	InstantSearch,
	Hits,
	SearchBox,
	Configure,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList
} from "react-instantsearch-dom";

function Hit(props) {
	return (
		<div>
			<img src={props.hit.image} align="left" alt={props.hit.name} />
			<div className="hit-name">
				<Highlight attribute="name" hit={props.hit} />
			</div>
			<div className="hit-description">
				<Highlight attribute="cat_desc" hit={props.hit} />
			</div>
			<div className="hit-price">${props.hit.bidPrice}</div>
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
				<InstantSearch
					indexName="biddable_products"
					searchClient={searchClient}
				>
					{triggerSearch && (
						<Styled.SearchUnderBoard>
							<div>
								<Box>
									<Box component="span" onClick={onCloseSearchBoard} sx={{cursor: "pointer"}}>
										<ClearIcon />
									</Box>
								</Box>
								<div className="left-panel">
									<ClearRefinements />
									<h2>Brands</h2>
									<RefinementList attribute="categories" />
									<Configure hitsPerPage={8} />
								</div>
								<div className="right-panel">
									<SearchBox />
									<Hits hitComponent={Hit} />
									<Pagination />
								</div>
							</div>
						</Styled.SearchUnderBoard>
					)}
				</InstantSearch>
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
