import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Loader from '../Loader';
import Message from '../Message';
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails, getReviews } from "../../actions/doctorActions"; 
import { createAppointment } from "../../actions/createAppointment";
import Rating from "../Rating";

function DoctorScreen({ history }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const doctorDetail = useSelector((state) => state.doctorDetail); 
  const { loading, error, doctor } = doctorDetail;

  const doctorReviews = useSelector((state) => state.doctorReviews);
  const { loading: loadingReviews, error: errorReviews, reviews } = doctorReviews;

  const appointmentCreate = useSelector((state) => state.appointmentCreate);
  const { loading: loadingAppointment, error: errorAppointment } = appointmentCreate;

  useEffect(() => {
    dispatch(getDoctorDetails(id));
    dispatch(getReviews(id));
  }, [dispatch, id]);

  const bookHandler = async () => {
    const appointmentData = {
      doctor: doctor.id, 
      appointment_time: new Date().toISOString()
    };

    console.log("Sending appointment data:", JSON.stringify(appointmentData));

    try {
      await dispatch(createAppointment(appointmentData)); 
      history.push(`/appointments`);
    } catch (error) {
      console.error("Failed to create appointment", error);
    }
  };
  return (
    <div className="container mx-auto p-1">
    <div>
    <Link to="/" className="my-3">
    <i className="fas fa-home p-3 text-gray-500 -mb-3 transition-colors duration-300 hover:text-[#0cc0df]"></i>
    </Link>    
    <span className="mr-3">/</span>
    <Link to={`/doctor/${id}`} className="my-3 font-semibold text-gray-500 truncate transition-colors duration-300 hover:text-[#0cc0df] no-underline">
        Doctor
    </Link>
    </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Please login first.</Message>
      ) : (
        doctor && (
          <>

           
            <Row>

            <Col md={10}>
            <div className="flex items-start items-center p-4">
              <div className="flex-shrink-0">
                <img
                  src={doctor.image}
                  alt="Profile"
                  className="w-11 h-10 rounded-full" 
                />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Dr. {doctor.user.name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="font-medium text-gray-500">{doctor.rating || "N/A"}</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-medium text-gray-500">{doctor.numReviews || 0} Reviews</span>
                </div>
              </div>
            </div>
            </Col>


            <Col md={6} className="w-[700px] h-[400px] mb-4"> 
              {doctor.image ? (
                  <Image
                      src={doctor.image}
                      alt={doctor.name}
                      className="rounded-lg shadow-md w-full h-full object-cover" 
                  />
              ) : (
                  <div className="h-full flex items-center justify-center bg-gray-200 rounded-lg">
                      <span>No image available</span>
                  </div>
              )}
          </Col>



              <Col md={3} className="ml-0">
                <Card className="shadow-md">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Booking Fee:</Col>
                        <Col>
                          <strong className="text-dark font-semibold">${doctor.fee || "N/A"}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Charge Rate:</Col>
                        <Col>
                          <span className="text-dark font-semibold">${doctor.charge_rates || "N/A"}/hr</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          <span className={`font-semibold ${doctor.available ? 'text-green-600' : 'text-red-600'}`}>
                            {doctor.available ? "Available" : "Not Available"}
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {loadingAppointment && <Loader />}
                      {errorAppointment && (
                        <Message variant="danger">{errorAppointment}</Message>
                      )}
                      <Button
                        className="w-full"
                        disabled={!doctor.available || loadingAppointment}
                        type="button"
                        variant="dark"
                        onClick={bookHandler}
                      >
                        Consult
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <Row className=" p-3 ">
  <Col md={6} className="bg-white shadow-md rounded-lg p-1">
    {/* <h4 className="text-lg font-semibold  pb-2 mb-4 text-gray-700">Reviews</h4> */}

    {(!reviews || reviews.length === 0) && (
      <Message variant="info">No Reviews</Message>
    )}

    {loadingReviews ? (
      <Loader />
    ) : errorReviews ? (
      <Message variant="danger">{errorReviews}</Message>
    ) : (
      <ListGroup variant="flush">
        {reviews.map((review) => (
          <ListGroup.Item key={review._id} className="border-b border-gray-300 py-4">
            <div className="flex justify-between items-center">
              <strong className="text-gray-800">{review.user_name}</strong>
              <Rating value={review.rating} color="f8e825" />
            </div>
            <p className="text-sm text-gray-500 mt-1">{review.createdAt ? review.createdAt.substring(0, 10) : "Date not available"}</p>
            <p className="text-gray-600 mt-1">{review.comment}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </Col>
</Row>

          </>
        )
      )}
    </div>
  );
}

export default DoctorScreen;
