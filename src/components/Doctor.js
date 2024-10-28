import React from "react";
import { Link } from "react-router-dom";

function Doctor({ doctor }) {
  return (
    <div className="max-w-xs mx-auto my-4 bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <Link to={`/doctor/${doctor.user._id}`}>
        <img
          className="w-full h-40 object-cover"
          src={doctor.image}
          alt={`Dr. ${doctor.user.name}`}
        />
      </Link>
      <div className="p-4">
        <Link
          to={`/doctor/${doctor.user._id}`}
          className="font-bold text-lg text-gray-800 truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline"
        >
          Dr. {doctor.user.name}
        </Link>
        <p className="text-gray-600 text-sm mt-1">
          <small>{doctor.description}</small>
        </p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <span className="text-yellow-400 text-lg">&#9733;</span>
            <span className="ml-1 text-gray-700">
              {doctor.rating} ({doctor.numReviews})
            </span>
          </div>
          <span className="font-semibold text-gray-800">
            ${doctor.charge_rates}/hr
          </span>
        </div>
      </div>
    </div>
  );
}

export default Doctor;
