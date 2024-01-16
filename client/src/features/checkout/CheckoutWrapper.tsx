import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

const stripePromise = loadStripe('pk_test_51OYrejG09HahXxRJDkQyvkl5Gt1MO0EfJA7tI4vmbdS3l8xdajR8jzK7Ac4oOy4HEXWQYfOj4uQ5jGxvdZxprAWl00IEJRZTgb');

export default function CheckoutWrapper() 
{
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    },[dispatch])

    if(loading) return <LoadingComponent message="Loading checkout ..."/>

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage/>
        </Elements>
    )
}