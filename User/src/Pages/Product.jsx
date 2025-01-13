import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid, Grow, Container, Box } from '@mui/material';
import { Productskeleten } from '../Component/Loading/Skeletenloadning';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';

const Product = () => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const { cat } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${Backend_url}/category/${cat}`);
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetching products", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cat]);

  const productSets = [];
  for (let i = 0; i < products.length; i += columns) {
    productSets.push(products.slice(i, i + columns));
  }

  return (
    <Container sx={{ paddingY: 6 }}>
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{
          fontWeight: "600",
          fontSize: "30px",
          textAlign: 'center',
          marginBottom: 6,
          color: colors.primary[100],
          textTransform: 'capitalize',
          fontFamily: "'Playfair Display', serif",
          letterSpacing: '1px',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
        }}
      >
        {cat ? `${cat} Collection` : 'Our Products'}
      </Typography>

      {loading ? (
        <Grid container spacing={4}>
          {Array.from({ length: columns * 2 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Productskeleten />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            textAlign: 'center',
            backgroundColor: colors.primary[6000],
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{
              color: colors.grey[100],
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '1px',
              fontSize: '1.5rem',
            }}
          >
            No products available in this category.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grow key={product._id} in timeout={500}>
              <Grid item xs={12} sm={6} md={4}>
                <Link to={`/viewproduct/${product._id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      backgroundColor: colors.primary[6000],
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        // boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.img1}
                      alt={product.product_name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          opacity: 0.8,
                        },
                      }}
                    />
                    <CardContent
                      sx={{
                        padding: 3,
                        backgroundColor: colors.primary[6000],
                        color: colors.grey[100],
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {product.product_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            </Grow>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Product;
