import React from "react";
import { Card } from "react-bootstrap";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded border-1 text-center">

        <Link to={`/product/${product._id}`}>
          <Card.Img
            src={product.image}
            style={{
              width: '250px',
              height: '200px',
              margin: '0 auto', 
              display: 'block',
            }}
          />
        </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="no-underline">
          <Card.Title as="div" className="font-bold text-lg text-gray-800 truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline">
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            {product.rating} from {product.numReviews} reviews
          </div>
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>

        <Rating
          value={product.rating}
          text={`${product.numReviews} reviews`}
          color={"#f8e825"}
        />
      </Card.Body>
    </Card>
  );
}

export default Product;
