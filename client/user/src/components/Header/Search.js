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
	// Hits,
	// SearchBox,
	Configure,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList,
	connectSearchBox,
	connectHits
} from "react-instantsearch-dom";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

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
					placeholder="Search by brand, name and more..."
					value={props.currentRefinement}
					onChange={e => props.refine(e.currentTarget.value)}
					autoFocus
					// smscreen="1"
					disableUnderline={true}
					sx={{ pl: 1 }}
				/>
			</form>
		</Box>
	);
}

const CustomSearchBox = connectSearchBox(mySearchBox);

const Hits = ({ hits, searchBoardOpener }) => (
	<ol
		style={{
			listStyleType: "none",
			backgroundColor: "#fff",
			display: "flex",
			flexDirection: "column",
			gap: 10
		}}
	>
		{hits.map(hit => (
			<li key={hit.objectID}>
				<Link
					size="small"
					// component={RouterLink}
					sx={{ color: "#333", display: "inline-block" }}
					underline="none"
					href={`/detail/${hit.id}?productId=${hit.productId}`}
					onClick={() => searchBoardOpener(false)}
				>
					<img
						src={hit.image}
						height={40}
						alt={hit.name}
						style={{ borderRadius: 10 }}
					/>
					<Typography variant="h5" className="hit-name">
						<Highlight attribute="name" hit={hit} />
					</Typography>
					<Typography variant="body1" className="hit-category">
						<Highlight attribute="category" hit={hit} />
					</Typography>
					<Typography variant="body2" className="hit-description">
						<Highlight attribute="cat_desc" hit={hit} />
					</Typography>
					<Typography variant="caption" className="hit-price">
						Bid @ Ksh.{hit.bidPrice}
					</Typography>
				</Link>
			</li>
		))}
	</ol>
);

const CustomHits = connectHits(Hits);

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
						placeholder="Search inventory by category, name and more..."
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
						placeholder="Search by brand, name and more..."
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
									sx={{ p: 1, cursor: "pointer" }}
									component="span"
									onClick={onCloseSearchBoard}
								>
									<ClearIcon />
								</Box>
							</Box>
							<Box
								sx={{
									display: "flex",
									width: "100%",
									alignItems: "stretch",
									minHeight: 400
								}}
							>
								<Styled.SearchLeftPane>
									<ClearRefinements />
									<Typography variant="h5" gutterBottom>
										Categories
									</Typography>
									<RefinementList attribute="category" />
								</Styled.SearchLeftPane>
								<Styled.SearchRightPane>
									<CustomSearchBox />
									{/* <SearchBox /> */}

									{/* <Hits hitComponent={Hit} /> */}
									<CustomHits searchBoardOpener={setTriggerSearch} />
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
