import React, { useRef } from "react";
import {
	Typography,
	Box,
	Button,
	TextField,
	CircularProgress,
	Divider,
	ListItem,
	Avatar,
	List,
	ListItemAvatar,
	CardContent,
	Card,
	ListItemText
} from "@mui/material";
import { batch, useDispatch, useSelector } from "react-redux";
import { Alert, AlertTitle } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { Formik, Field, getIn } from "formik";
import * as Yup from "yup";

import { makeBid } from "../../../../../redux/actions/products";
import { storeService } from "../../../../../api/storeService.js";
import useStyles from "./styles.js";

const DarkBox = ({ product, topBidder }) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const { err, loading, status } = useSelector(state => state.app);
	let newBidder = Boolean(status?.info?.code === "newbiddinguser");
	const darkBoxElement = useRef();

	//form initial values
	let initialValues = {
		bidAmount: product?.bidPrice || "",
		bidder: {
			phone: "",
			acknowledgeNew: newBidder,
			firstname: "",
			lastname: "",
			location: ""
		},
		bidPrice: product?.bidPrice || "",
		productId: product?.product?._id
	};
	if (newBidder) {
		darkBoxElement?.current?.scrollIntoView({ behaviour: "smooth" });
		// window.scroll({ top: 2, left: 0, behavior: "smooth" });
		if (window.sessionStorage && sessionStorage.getItem("bidderFormData")) {
			const previousBidderFormData = JSON.parse(
				sessionStorage.getItem("bidderFormData")
			);
			previousBidderFormData.bidder.acknowledgeNew = newBidder;
			Object.assign(initialValues, previousBidderFormData);
		}
	}

	let formFields = [
		"bidAmount",
		"bidder.phone",
		"bidder.lastname",
		"bidder.firstname",
		"bidder.location"
	];
	let formErrors = [];
	let formErrorsName = [];
	formErrors =
		err.length && err.filter(error => formFields.includes(error.param));
	formErrors.length &&
		formErrors.map(error => formErrorsName.push(error.param));

	const makeBidSchema = Yup.object().shape({
		bidAmount: Yup.number()
			.required("Bidding amount is required")
			.positive("This amount is not allowed")
			.min(product?.bidPrice, `Minimum bidding amount is ${product?.bidPrice}`)
			.integer(),
		bidder: Yup.object().shape({
			phone: Yup.number("You phone number should be numerical")
				.required("Phone number is required")
				.integer(),
			acknowledgeNew: Yup.boolean(),
			firstname: Yup.string().when("acknowledgeNew", {
				is: true,
				then: Yup.string().required("Your other name(firstname) is required")
			}),
			lastname: Yup.string().when("acknowledgeNew", {
				is: true,
				then: Yup.string().required("Your surname is required")
			}),
			location: Yup.string().when("acknowledgeNew", {
				is: true,
				then: Yup.string().required(
					"Your location(e.g nearest town) is required"
				)
			})
		})
	});

	const Input = ({
		form,
		field: { value, name },
		formErrors,
		formErrorsName,
		...others
	}) => {
		return (
			<TextField
				name={name}
				value={value}
				error={
					(getIn(form.touched, name) && !!getIn(form.errors, name)) ||
					formErrorsName.indexOf(name) !== -1
				}
				helperText={
					(getIn(form.touched, name) && getIn(form.errors, name)) ||
					(formErrorsName.indexOf(name) !== -1 &&
						formErrors[formErrorsName.indexOf(name)].msg)
				}
				onChange={form.handleChange}
				onBlur={form.handleBlur}
				variant="outlined"
				margin="normal"
				className={classes.rootTextField}
				fullWidth
				{...others}
			/>
		);
	};

	return (
		<Box className={classes.darkBox} ref={darkBoxElement}>
			<Card className={classes.cardRoot}>
				{/* <Typography
          className={classes.white}
          style={{ padding:8,margin:5}}
          variant="h5"
        >Place your bid now
        </Typography> */}
				<CardContent>
					{topBidder?.user ? (
						<>
							<Typography gutterBottom variant="body1">
								CURRENT HIGHEST BIDDER
							</Typography>
							<List>
								<ListItem>
									<ListItemAvatar>
										<Avatar>
											<ImageIcon />
										</Avatar>
									</ListItemAvatar>
									<ListItemText primary={topBidder?.user?.fullname} />
									<ListItemText
										primary={`KES ${topBidder?.bidAmountTotal ?? 0}`}
									/>
								</ListItem>
							</List>
							<Divider color="grey" />
						</>
					) : null}
					<Typography
						gutterBottom
						variant="body2"
						color="inherit"
						component="p"
					>
						Place your bid Bid. Minimum Bid amount is {product?.bidPrice}
						/= . Enter phone number then standby to pay via Mpesa
					</Typography>

					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						onSubmit={function (values, actions) {
							if (window.sessionStorage) {
								sessionStorage.setItem(
									"bidderFormData",
									JSON.stringify(values)
								);
							}

							let currentCard = document.querySelector(
								`#bid4m-${product?._id}`
							);
							currentCard.dataset.id === product?._id &&
								batch(() => {
									dispatch(
										makeBid(
											values,
											storeService.bidInView,
											storeService.productInView
										)
									);
								});
						}}
						validationSchema={makeBidSchema}
					>
						{props => (
							<form
								onSubmit={props.handleSubmit}
								id={"bid4m-" + product?._id}
								autoComplete="off"
								noValidate
								data-id={product?._id}
							>
								{newBidder ? (
									<>
										<Alert severity={"info"} sx={{ width: "100%" }}>
											<AlertTitle>Hello there</AlertTitle>
											Chances are this could be your first bid. Just a little
											more information and get your bid going.
										</Alert>
										<Field
											name="bidder.lastname"
											label="surname name"
											formErrors={formErrors}
											formErrorsName={formErrorsName}
											component={Input}
										/>
										<Field
											name="bidder.firstname"
											label="other name"
											formErrors={formErrors}
											formErrorsName={formErrorsName}
											component={Input}
										/>
										<Field
											name="bidder.location"
											label="Your location"
											formErrors={formErrors}
											formErrorsName={formErrorsName}
											component={Input}
										/>
									</>
								) : null}
								<Field
									formErrors={formErrors}
									formErrorsName={formErrorsName}
									name="bidAmount"
									label="Bid amount"
									placeholder="for example 237"
									inputProps={{ min: product?.bidPrice }}
									type="number"
									component={Input}
								/>
								<Field
									formErrors={formErrors}
									formErrorsName={formErrorsName}
									name="bidder.phone"
									label="Phone number"
									type="number"
									component={Input}
								/>

								<Button
									type="submit"
									variant="contained"
									color="primary"
									fullWidth
								>
									{loading ? (
										<CircularProgress
											disableShrink
											style={{ color: "white" }}
										/>
									) : (
										"Place your bid"
									)}
								</Button>
							</form>
						)}
					</Formik>
				</CardContent>
			</Card>
		</Box>
	);
};

export default React.memo(DarkBox);
