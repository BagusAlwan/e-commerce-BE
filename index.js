const express = require ('express');
const dbConnect = require('./config/dbConnect');
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8080;
const authRouter = require('./routers/authRoute');
const productRouter = require('./routers/productRoute')
const blogRouter = require('./routers/blogRoute')
const categoryRouter = require('./routers/prodcategoryRoute')
const blogcategoryRouter = require('./routers/blogcategoryRoute')
const brandRouter = require('./routers/brandRoute')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
 console.log(`Server is running at PORT: ${PORT}`);
});
