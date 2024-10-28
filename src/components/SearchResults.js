import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function SearchResults() {
  const searchResults = useSelector(state => state.searchResults);
  const { doctor_results, product_results } = searchResults;

  return (
    <div>
      <h2>Search Results</h2>
      {/* <h6>Doctors</h6> */}
      <ul>
        {doctor_results.map((doctor) => (
            <>
            <li >
          <Link
          to={`/doctor/${doctor.user._id}`}
          className="truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline"
        >
          Dr. {doctor.user.name}
        </Link>
        {" | "}{doctor.specialization} - {doctor.description}</li>
        </>
        ))}
      </ul>
      
      {/* <h6>Products</h6> */}
      <ul>
        {product_results.map((product) => (

          <>
          <li >
        <Link
        to={`/product/${product._id}`}
        className="truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline"
      >
        {product.name}
      </Link>
      {" | "}{product.description} - Price: ${product.price}</li>
      </>

        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
