import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentDetails, payAppointment } from '../../actions/createAppointment';
import { Spinner, Alert, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../Loader';
import './PayAppointmentScreen.css'; 

const PayAppointmentScreen = ({history}) => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const appointmentDetails = useSelector((state) => state.appointmentDetails);
    const { loading, error, appointment } = appointmentDetails;

    const [sdkReady, setSdkReady] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getAppointmentDetails(id));
        }
    }, [dispatch, id]);

    const addPayPalScript = () => {
        if (!document.querySelector(`script[src*="paypal.com/sdk/js"]`)) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://www.paypal.com/sdk/js?client-id=AfWCkVHsxTIHY7IU9rVzqHLAFUcZjU6Lnrqf8h81x7cIdpIJHvomiPo4Vr_RqlayO56tCESJ9D0r6ldo';
            script.async = true;
            script.onload = () => setSdkReady(true);
            document.body.appendChild(script);
        } else {
            setSdkReady(true);
        }
    };

    useEffect(() => {
        if (appointment) {
            if (appointment.status === 'Pending' && !appointment.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            } else {
                setSdkReady(true); 
            }
        }
    }, [appointment]);

    const successPaymentHandler = (paymentResult) => {
        console.log('Payment Result:', paymentResult);
        dispatch(payAppointment(id, paymentResult));
        history.push('/appointments')
        window.location.reload();
    };

    return (
        <Container className="payment-screen-container my-5">
        {loading ? (
            <Spinner animation="border" variant="primary" />
        ) : error ? (
            <Alert variant="danger">{error}</Alert>
        ) : (
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <h4 className="text-center mb-4">Pay for Booking</h4>
                        {appointment && (
                            <div className="appointment-details">
                                {/* <h5 className="font-weight-bold">Client: <span>{appointment.user_name}</span></h5> */}
                                <h5 className="font-weight-bold">Dr. <span>{appointment.doctor_name}</span></h5>
                                <h6 className="font-weight-normal">Date: <span>{new Date(appointment.appointment_time).toLocaleDateString('en-US')}</span></h6>
                                <h6 className="font-weight-normal">Status: <span>{appointment.isPaid ? 'Booking Already Paid' : appointment.status}</span></h6>
                                <h6 className="font-weight-normal">Price: <span className="text-success">${appointment.fee}</span></h6>
                                {!appointment.isPaid ? (
                                    !sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <div className="text-center paypal-button">
                                            <PayPalButton
                                                className="paypal-button"
                                                amount={appointment.fee}
                                                onSuccess={successPaymentHandler}
                                                options={{
                                                    clientId: "AfWCkVHsxTIHY7IU9rVzqHLAFUcZjU6Lnrqf8h81x7cIdpIJHvomiPo4Vr_RqlayO56tCESJ9D0r6ldo",
                                                    currency: "USD",
                                                }}
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="text-success"></div>
                                )}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        )}
    </Container>
    );
};

export default PayAppointmentScreen;
