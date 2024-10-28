import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from "react-bootstrap";
import { listDoctors } from '../../actions/doctorActions';
import Loader from '../Loader';
import Message from '../Message';
import Doctor from '../Doctor';
import { Link } from "react-router-dom";
function HomeScreen() {
    const dispatch = useDispatch();
    const doctorList = useSelector((state)=>state.doctorList);
    const {error,loading,doctors} =doctorList
    useEffect(() => {
        dispatch(listDoctors());
    }, [dispatch]);

    return (
        <div className="text-center">
            <Row className="mt-4">
                <div className="d-flex justify-content-start mb-3">
                    <h5 className="">Recommended Doctors</h5>
                </div>
    
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <Row>
                        {doctors && doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <Col key={doctor._id} sm={12} md={6} lg={4} xl={3}>
                                    <Doctor doctor={doctor} />
                                </Col>
                            ))
                        ) : (
                            <Message variant='info'>No doctors found.</Message>
                        )}
                    </Row>
                )}
            </Row>
        </div>
    );
    
}

export default HomeScreen;
