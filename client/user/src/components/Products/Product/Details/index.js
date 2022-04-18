import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LightBox from "./LightBox";
import DarkBox from "./DarkBox";
import BiddersBox from "./BiddersBox";
import ShowFeedback from "../../../utils/ShowFeedback";
import { unsetErr, unsetStatus } from "src/redux/actions/errors";
import { getProductDetails } from "src/redux/actions/products.js";
import { storeService } from "src/api/storeService.js";
import Styled from "./Styled.js";

const Detail = () => {
	const { details: focusProductDetails, loading } = useSelector(
		state => state.selectedProductDetails
	);
	const { err, status } = useSelector(state => state.app);
	const dispatch = useDispatch();
	const [alertOpen, setAlertOpen] = useState(Boolean(status?.info));
	const [errAlertOpen, setErrAlertOpen] = useState(Boolean(err.length > 0));
	const locationRouter = useLocation();
	const [product, setProduct] = useState({});
	const useQuery = () => new URLSearchParams(locationRouter.search);
	const query = useQuery();
	const productId = query.get("productId");
	const { bidId } = useParams();

	console.log("hey productId", productId);

	function rehydrateProduct(bidId, productId) {
		dispatch(getProductDetails(bidId, productId));
	}

	useEffect(() => {
		const routeStateProduct = locationRouter?.state?.product;
		if (routeStateProduct) {
			storeService.saveBidInViewId = routeStateProduct._id;
			storeService.saveProductInViewId = routeStateProduct.product._id;
			setProduct(routeStateProduct);
		}
		rehydrateProduct(
			bidId || routeStateProduct._id || storeService.bidInView,
			productId || routeStateProduct.product._id || storeService.productInView
		);
		return () => {
			dispatch(unsetErr());
			dispatch(unsetStatus());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		focusProductDetails && setProduct(focusProductDetails.product);
	}, [focusProductDetails]);
	useEffect(() => {
		setAlertOpen(Boolean(status?.info));
	}, [status]);
	useEffect(() => {
		setErrAlertOpen(Boolean(err.length > 0));
	}, [err]);

	return (
		<>
			<ShowFeedback
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				severity={status?.info?.severity}
				msg={status?.info?.message}
			/>
			{err.length > 0 &&
				err.map(error => (
					<ShowFeedback
						alertOpen={errAlertOpen}
						setAlertOpen={setErrAlertOpen}
						severity={"error"}
						msg={error.msg}
						title="Ooops!"
					/>
				))}

			<Grid container sx={{ justifyContent: "space-between", my: 2 }}>
				<Grid
					item
					xs={12}
					md={3}
					component={Stack}
					sx={{ alignItems: "center", justifyContent: "center" }}
				>
					<LightBox product={product} loading={loading} />
				</Grid>

				{focusProductDetails?.bidders?.topActiveBidders.length > 0 && (
					<Styled.BiddersBoxContainer>
						<BiddersBox
							bidders={focusProductDetails?.bidders}
							loading={loading}
						/>
					</Styled.BiddersBoxContainer>
				)}
				<Grid item xs={12} md={4}>
					<DarkBox
						product={product}
						topBidder={focusProductDetails?.bidders?.highestBidder}
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default React.memo(Detail);
