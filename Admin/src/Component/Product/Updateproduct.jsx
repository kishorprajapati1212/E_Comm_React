import React, { useEffect, useState } from 'react';
import { Box, Modal, Backdrop, Fade, Button, TextField, useTheme, FormControl, MenuItem, Select, InputLabel, Input, IconButton } from '@mui/material';
import { Theme } from '../../Theme';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const Updateproduct = ({ selectedproduct, close, open, onProductUpdated }) => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL;

  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const [product, setProduct] = useState({
    stock: '',
    product_name: '',
    price: '',
    model: '',
    img1: '',
    desc: '',
    cat: 'other',
    sale_cat: 'other',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedproduct) {
      setProduct({
        product_name: selectedproduct.product_name,
        price: selectedproduct.price,
        model: selectedproduct.model,
        img1: selectedproduct.img1,
        desc: selectedproduct.desc,
        cat: selectedproduct.cat,
        sale_cat: selectedproduct.sale_cat,
        stock: selectedproduct.stock,
      });
    }
  }, [selectedproduct]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'model' || name === 'img1') {
      const file = files[0];
      if (file) {
        const base64String = name === 'img1' ? await convertFileToBase64(file) : file;
        setProduct({ ...product, [name]: name === 'img1' ? base64String : file });
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('product_name', product.product_name);
      formData.append('price', product.price);
      formData.append('model', product.model); // Ensure this is the file object
      formData.append('img1', product.img1); // Ensure this is the correct format
      formData.append('desc', product.desc);
      formData.append('stock', product.stock);
      formData.append('cat', product.cat);
      formData.append('sale_cat', product.sale_cat);
      console.log(product)
      const response = await axios.post(`${Backend_url}/updateproduct/${selectedproduct._id}`, formData);
      console.log(response.data);
      onProductUpdated();
      close();
    } catch (error) {
      console.error("Error during form submission:", error.response ? error.response.data : error.message);
    }
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to read file.'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={close}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: colors.grey[100],
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '700px',
            color: '#000',
            overflowY: 'auto',
            maxHeight: "80vh",
          }}
        >
          <IconButton style={{ position: 'absolute', top: '10px', right: '10px', color: colors.primary[400] }} onClick={close}>
            <CloseIcon />
          </IconButton>
          <h2 style={{ color: '#000' }}>Update the product</h2>
          <Box sx={{ mt: "20px" }}>
            <TextField
              name="product_name"
              label="Product Name"
              variant="outlined"
              fullWidth
              InputProps={{ style: { color: '#000', margin: '10px' }}}
              value={product.product_name}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#000', margin: '10px' }}}
            />
            <TextField
              name="price"
              label="Product Price"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ style: { color: '#000', margin: '10px' }}}
              value={product.price}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#000', margin: '10px' }}}
            />
            <TextField
              name="desc"
              label="Product Description"
              variant="outlined"
              fullWidth
              InputProps={{ style: { color: '#000', margin: '10px' }}}
              value={product.desc}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#000', margin: '10px' }}}
            />
            <TextField
              name="stock"
              label="Stock"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ style: { color: '#000', margin: '10px' }}}
              value={product.stock}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#000', margin: '10px' }}}
            />
            <FormControl fullWidth variant="outlined" sx={{ mt: "10px" }}>
              <InputLabel htmlFor="product-category" style={{ color: '#000', margin: '10px' }}>
                Product Category
              </InputLabel>
              <Select
                value={product.cat}
                onChange={handleChange}
                inputProps={{ name: 'cat', id: 'product-category' }}
                style={{ color: '#000', margin: '10px' }}
              >
                <MenuItem value="" disabled>Select Category</MenuItem>
                <MenuItem value="Shirt">Shirt</MenuItem>
                <MenuItem value="Pants">Pants</MenuItem>
                <MenuItem value="T-Shirt">T-Shirt</MenuItem>
                <MenuItem value="Sweater">Sweater</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: "10px" }}>
              <InputLabel htmlFor="sale-category" style={{ color: '#000', margin: '10px' }}>
                Sale Category
              </InputLabel>
              <Select
                value={product.sale_cat}
                onChange={handleChange}
                inputProps={{ name: 'sale_cat', id: 'sale-category' }}
                style={{ color: '#000', margin: '10px' }}
              >
                <MenuItem value="" disabled>Select Sale Category</MenuItem>
                <MenuItem value="Winter">Winter</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
                <MenuItem value="Monsoon">Monsoon</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ ml: "10px", color: '#000' }}>
              <label>Update the Image
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  name="img1"
                  sx={{ ml: "300px", color: "black" }}
                />
              </label>
              <h6>Current Photo
                {product.img1 && (
                  <img
                    src={product.img1}
                    alt={`NEW IMAGE UPDATED`}
                    style={{ width: '25%', height: 'auto', borderRadius: '8px', marginLeft: "300px", border: "2px solid black" }}
                  />
                )}
              </h6>
            </Box>
            <br />

            <Box sx={{ ml: "10px" }}>
              <label>Current Model:</label>
              <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>{product.model ? product.model.name : ''}</span>
            </Box>
            <Box sx={{ ml: "10px" }}>
              <label>Update The Model:</label>
              <input type="file" id="productModel" name="model" onChange={handleChange} className="form-control" />
            </Box>

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: "10px", ml: '20px' }}>
              Update Product
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default Updateproduct;
