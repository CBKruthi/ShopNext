import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  }
    catch (err) {
    res.status(500).json({ message: 'Server error' });
    }

};

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    try {
        let imageURL = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageURL= result.secure_url;
            console.log('imageURL uploaded to Cloudinary:', imageURL);
        }
        const product = new Product({
            imageURL: imageURL,
            name,
            description,
            price,
            category,
            stock
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
    console.log("ERROR NAME:", err.name);
    console.log("ERROR MESSAGE:", err.message);
    console.log("ERROR HTTP CODE:", err.http_code);
    console.log("ERROR:", err);

    res.status(500).json({
        message: err.message,
        cloudinaryCode: err.http_code
    });
}
};  


const updateProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageURL = result.secure_url;
                console.log('imageURL uploaded to Cloudinary:', product.imageURL);    
            }
            product.imageURL = product.imageURL || product.imageURL;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };