import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import useCart from "../../../../hooks/useCart";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuthValue from "../../../../hooks/useAuthValue";
import { useNavigate } from "react-router-dom";
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthValue();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const { cart, refetch } = useCart();
  const axiosSecure = useAxiosSecure();
  const nav = useNavigate();
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);


  useEffect(() => {
    if (totalPrice > 0) {
      const createIntent = async () => {
        try {
          const { data } = await axiosSecure.post("/create-payment-intent", {
            price: totalPrice,
          });
          setClientSecret(data?.clientSecret);
        } catch (err) {
        
          setErrorMessage(`Failed to initialize payment: ${err?.message}`);
        }
      };
      createIntent();
    }
  }, [axiosSecure, totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setErrorMessage("");
    const card = elements.getElement(CardElement);
   
    if (!card) return;

    try {
      // eslint-disable-next-line no-unused-vars
      const { error: methodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (methodError) {
        // console.log("paymentMethod Error", methodError);
        setErrorMessage(methodError?.message);
        return;
      }
      // console.log("[PaymentMethod]", paymentMethod);

      // Confirm Payment
      const { error: cardIntentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "anonymous",
              name: user.displayName || "anonymous",
            },
          },
        });

      if (cardIntentError) {
        setErrorMessage(cardIntentError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const payment = {
          email: user?.email,
          name: user?.displayName,
          price: totalPrice,
          transactionId: paymentIntent.id,
          status: "pending",
          cartItemIds: cart.map((item) => item._id),
          menuItemIds: cart.map((item) => item.menuId),
      
        };
        const { data } = await axiosSecure.post("/payment", payment);
        if (data?.paymentInsertResult?.insertedId) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            timer: 1500,
            showConfirmButton: false,
          });
          nav("/dashboard/payment_history");
        }
      }
    } catch (err) {
      // console.log(err);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: err.message || "Something went wrong",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      className="md:w-[60%] mx-auto border p-4 rounded-xl space-y-7"
      onSubmit={handleSubmit}
    >
      <p className="font-medium tracking-wide">
        Your total Order is: {totalPrice.toFixed(2)}
      </p>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <button
        className=" bg-linear-to-l to-[#835D23] from-[#B58130]  disabled:bg-gray-800 disabled:cursor-not-allowed focus:scale-105 px-6 py-2 rounded-md text-white max-w-36"
        type="submit"
        disabled={!stripe || !elements || !clientSecret || processing}
      >
        {processing ? "Paying" : "Pay"}
      </button>
      {errorMessage && (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      )}
    </form>
  );
};

export default CheckoutForm;
