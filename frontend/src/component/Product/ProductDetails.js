import React, { Fragment, useEffect, useState } from 'react'

import "./ProductDetails.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'
import ReactStars from 'react-rating-stars-component';
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader"
import { useAlert } from "react-alert";
import { addItemsToCart } from "../../actions/cartAction"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";






const ProductDetails = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const { id } = useParams();
    const navigate = useNavigate()

    const { product, loading, error } = useSelector(state => state.productDetails)
    const { isAuthenticated } = useSelector(state => state.user)

    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );

    const options = {

        precision: 0.5,
        size: 'large',
        value: product.ratings,
        readOnly: true
    }

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const incraeseQuantity = () => {
        if (product.stock <= quantity) return

        const qty = quantity + 1
        setQuantity(qty)
    }

    const decreaseQuantity = () => {
        if (quantity <= 1) return
        const qty = quantity - 1
        setQuantity(qty)
    }

    const addToCarthandler = () => {
        dispatch(addItemsToCart(id, quantity))
        alert.success("Item Added To Cart")
        if (isAuthenticated === false) {
            navigate("/login")
        }
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));

        setOpen(false);
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert, reviewError, success]);

    return (
        <Fragment>

            {loading ? <Loader /> : (<Fragment>
                <div className="ProductDetails">

                    <div>
                        <Carousel>
                            {
                                product.images && product.images.map((item, i) => (
                                    <img
                                        className="CarouselImage"
                                        key={item.url}
                                        src={item.url}
                                        alt={`${i} Slide`}
                                    />
                                ))
                            }
                        </Carousel>

                    </div>
                    <div>
                        <div className="detailsBlock-1">
                            <h2>{product.name}</h2>
                            <p>product # {product._id}</p>
                        </div>
                        <div className="detailsBlock-2">
                            <Rating {...options} />
                            <span>({product.numOfReviews} Reviews )</span>
                        </div>
                        <div className="detailsBlock-3">
                            <h1>{`₹${product.price}`}</h1>
                            <div className='detailsBlock-3-1'>
                                <div className='detailsBlock-3-1-1'>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input readOnly type="number" value={quantity} />
                                    <button onClick={incraeseQuantity}>+</button>
                                </div>
                                <button disabled={product.stock < 1 ? true : false} onClick={addToCarthandler}>Add to Cart</button>
                            </div>

                            <p>
                                Status : <b1> </b1>
                                <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                    {product.stock < 1 ? "Out Of Stock" : "InStock"}
                                </b>
                            </p>
                        </div>

                        <div className='detailsBlock-4'>
                            Description : <p>{product.description}</p>
                        </div>
                        <button onClick={submitReviewToggle} className="submitReview">
                            Submit Review
                        </button>
                    </div>
                </div>

                <h3 className='reviewsHeading'> Reviews</h3>

                <Dialog
                    aria-labelledby="simple-dialog-title"
                    open={open}
                    onClose={submitReviewToggle}
                >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className="submitDialog">
                        <Rating
                            onChange={(e) => setRating(e.target.value)}
                            value={rating}
                            size="large"
                        />

                        <textarea
                            className="submitDialogTextArea"
                            cols="30"
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={submitReviewToggle} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={reviewSubmitHandler} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                {product.reviews && product.reviews[0] ? (
                    <div className='reviews'>
                        {product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}

                    </div>
                ) : (
                    <p className='noReviews'>No Reviews yet</p>
                )}

            </Fragment >)}

        </Fragment>

    )
}

export default ProductDetails