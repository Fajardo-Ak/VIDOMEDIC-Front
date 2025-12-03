import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";

const stripePromise = loadStripe("pk_test_xxxxxx");

export default function Pago() {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        axios.post("http://localhost:8000/api/create-subscription", {
            price_id: "price_12345"
        }).then(res => setClientSecret(res.data.clientSecret));
    }, []);

    const options = {
        clientSecret,
        appearance: {
            theme: "flat",
            variables: {
                colorPrimary: "#4763E4",
                colorBackground: "#ffffff",
                colorText: "#000000",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <FormularioPago />
                </Elements>
            )}
        </div>
    );
}

function FormularioPago() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3001/inicio"
            },
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                Pagar
            </button>
        </form>
    );
}
