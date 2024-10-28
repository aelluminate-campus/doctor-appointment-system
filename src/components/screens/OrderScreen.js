import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../Message'
import Loader from '../Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../../constants/orderConstants'
// import './PayAppointmentScreen.css'; 

function OrderScreen({ match, history }) {
    const orderId = match.params.id
    const dispatch = useDispatch()


    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AfWCkVHsxTIHY7IU9rVzqHLAFUcZjU6Lnrqf8h81x7cIdpIJHvomiPo4Vr_RqlayO56tCESJ9D0r6ldo'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {

        if (!userInfo) {
            history.push('/login')
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

      


    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
                <Container className='align-items-center justify-content-center' style={{ width: '700px' }}>
                    {/* <h1>Order: {order.Id}</h1> */}
                    <Row>
                        <Col md={12} >
                           <Card >
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2 className='text-center'>Chosen Medicine</h2>
                                    {order.orderItems.length === 0 ? <Message variant='info'>
                                        Please choose a medicine to purchase.
                            </Message> : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index} >
                                                    <Row className="align-items-center">
                                                      <Col md={1} className="mx-auto">
                                                      <div style={{ width: '150px' }}> {/* Adjust the width as needed */}
                                                        <Image src={item.image} alt={item.name} fluid className="d-block" />
                                                      </div>                                     
                                                      </Col>

                                                      <Col md={3} className="mx-auto">
                                                        <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            <h6>{item.name}</h6>
                                                        </Link>
                                                    </Col>


                                                    </Row>
                                                  </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                </ListGroup.Item>

                            </ListGroup>
                            </Card>
                        </Col>

                        <Col md={12}>
                            <Card className='text-center'>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Purchase Summary</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                               

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>


                                    {!order.isPaid && (
                                       <ListGroup.Item style={{ width: '100%' }} className="align-items-center  justify-content-center">
                                       {loadingPay && <Loader />}
                                       {!sdkReady ? (
                                           <Loader />
                                       ) : (

                                               <PayPalButton
                                                //    className="paypal-button"
                                                   amount={order.totalPrice}
                                                   onSuccess={successPaymentHandler}
                                               />
                                    
                                       )}
                                   </ListGroup.Item>
                                   
                                    )}
                                </ListGroup>
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}

                                {order.isDelivered && (
                                    <ListGroup.Item>
                                        <Message variant='success'>Successfully Delivered</Message>
                                    </ListGroup.Item>
                                )}

                            </Card>
                        </Col>
                    </Row>
                </Container>
            )
}

export default OrderScreen