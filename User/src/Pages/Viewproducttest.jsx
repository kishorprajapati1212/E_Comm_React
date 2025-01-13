// Viewproduct.js
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { singleproduct } from '../Store/Productslic';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';
import { cartadd } from '../Store/cartslice';
import { getuser } from '../Component/Navbar';
import { Skeleton, Rating, TextField, Button } from '@mui/material';
import AlertPopup from '../Component/Aleart/Alertmess';
import { loadModel } from '../ModelLoad/Modelload';

const Viewproduct = () => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

  const containerRef = useRef();
  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const { productid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.product);

  const [alertMessage, setAlertMessage] = useState({ message: '', severity: '', open: false });
  const [user, setUser] = useState(getuser());
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const userid = user && user.user ? user.user._id : null;
  const { _id, product_name, desc, img1, price } = product || {};
  console.log(product)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(singleproduct(productid));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, productid]);

  useEffect(() => {
    const loadModelData = async () => {
      try {
        const modelEndpoint = `${Backend_url}/productmodel/${productid}`;
        const res = await fetch(modelEndpoint);

        if (!res.ok) {
          throw new Error(`Failed to fetch model. Status: ${res.status}`);
        }

        const fbxBuffer = await res.arrayBuffer();

        if (!fbxBuffer || !fbxBuffer.byteLength) {
          console.error('Invalid binary code for the model');
          return;
        }

        loadModel(fbxBuffer, containerRef.current);
        console.log(loadModel)
        setLoading(false);
      } catch (error) {
        console.error('Error loading model:', error.message);
        setImg(true);
      }
    };

    loadModelData();
  }, [productid]);

  const handleAddToCart = async () => {
    try {
      if (!userid) {
        navigate('/login');
        return;
      }

      const response = await dispatch(cartadd({ userid, productid: _id }));

      if (response && response.error) {
        setAlertMessage({ message: 'Product is already in cart', severity: 'error', open: true });
      } else {
        setAlertMessage({ message: 'Product successfully added to cart', severity: 'success', open: true });
      }
    } catch (error) {
      console.error('Error dispatching cartadd:', error);
      setAlertMessage({ message: 'Failed to add product', severity: 'error', open: true });
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!userid) {
        navigate('/login');
        return;
      }

      const reviewData = { userid, productid: _id, review, rating };
      const response = await fetch(`${Backend_url}/addreview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setAlertMessage({ message: 'Review submitted successfully', severity: 'success', open: true });
        setReview('');
        setRating(0);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setAlertMessage({ message: 'Failed to submit review', severity: 'error', open: true });
    }
  };

  return (
    <>
      {alertMessage.message && (
        <AlertPopup
          message={alertMessage.message}
          severity={alertMessage.severity}
          open={alertMessage.open}
          setOpen={setAlertMessage}
        />
      )}

      <div
        className="app"
        style={{
          margin: '50px auto ',
          padding: '20px',
          maxWidth: '1200px',
          display: 'flex',
          backgroundColor: colors.grey[8000],
          height: 'auto',
        }}
      >
        <div
          className="big-item"
          style={{ position: 'relative', transform: 'rotateY(20deg)', transition: 'transform 0.3s', flex: 1 }}
        >
          {!loading ? (
            img ? (
              <img src={img1} style={{ width: '100%', height: '450px' }} />
            ) : (
              <div ref={containerRef} style={{ width: '100%', height: '450px', borderRadius: '10px', background: `linear-gradient(to top, ${colors.primary[800]}, ${colors.primary[8000]})` }} />
            )
          ) : (
            <Skeleton width={500} height={300} />
          )}
        </div>

        <div
          className="details"
          style={{
            marginBottom: '20px',
            // border: '2px solid grey',
            boxShadow: `0px 0px 30px 5px rgba(0,255,255,0.08) `,
            marginLeft: '20px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.primary[8000],
            overflow: "hidden"
          }}
        >
          <div style={{ lineHeight: "1.5rem", marginBottom: '0px', display: 'flex', alignItems: 'center', marginLeft: '10px', marginRight: '10px' }}>
            <h2 style={{ fontSize: '2.5rem', marginRight: '10px', fontFamily: "'futuristic'", textTransform: 'uppercase', }}>
              {product_name ? product_name : <Skeleton width={200} />}
            </h2>
            <span style={{ fontSize: '1.2rem', color: colors.greenAccent[400], marginLeft: 'auto' }}>
              ${price || <Skeleton width={100} />}
            </span>
          </div>
          <p style={{ fontSize: '1rem', margin: '10px 10px', }}>{desc ? desc.slice(0, 500) : <Skeleton count={30} />}</p>
          <button
            onClick={handleAddToCart}
            style={{
              margin: '10px 10px',
              fontSize: '1rem',
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add to Cart
          </button>

          <div style={{ margin: '10px 10px' }}>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              precision={0.5}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              value={review}
              onChange={(e) => setReview(e.target.value)}
              multiline
              rows={4}
              placeholder="Write your review here"
              fullWidth
              variant="outlined"
              style={{ marginBottom: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .app {
              flex-direction: column;
            }
            .big-item {
              margin-bottom: 20px;
              margin-left: 0;
              transform: none;
              width: 70%;
              height: auto;
            }
            .details {
              text-align: center;
            }
            h2 {
              font-size: 2rem;
           

            }
            span {
              font-size: 1rem;
            }
            p {
              font-size: 0.8rem;
            }
          }
        `}
      </style>

    </>
  );
};

export default Viewproduct;
