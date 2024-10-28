import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Message'
import CheckoutSteps from '../CheckoutSteps'
import { createOrder } from '../../actions/orderActions'
import { ORDER_CREATE_RESET } from '../../constants/orderConstants'

function PlaceOrderScreen({ history }) {

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, error, success } = orderCreate

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)

    cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.taxPrice)).toFixed(2)


    if (!cart.paymentMethod) {
        history.push('/payment')
    }

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
    }, [success, history])

    const placeOrder = () => {
        dispatch(createOrder({
            orderItems: [cart.cartItems[0]],
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }))
    }

    return (
        <Container  className='align-items-center justify-content-center' style={{ width: '700px' }}>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={12}>
                    <ListGroup variant='flush' className='text-center'>

                    <ListGroup.Item>
                            <h2 style={{textAlign: 'left'}}>Address</h2>
                         

                            <p style={{textAlign: 'left'}}>
                           
                                {cart.shippingAddress.address},  {cart.shippingAddress.city}
                                {'  '}
                                {cart.shippingAddress.postalCode},
                                {'  '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                    <ListGroup>
                           
                            {cart.cartItems.length === 0 ? <Message variant='info'>
                                Your cart is empty
                            </Message> : (
                                    <ListGroup>
                                        <ListGroup.Item>
                                            <Row className="justify-content-center">
                                            <Col  className="d-flex justify-content-center">
                                            <div style={{ width: '150px' }}>
                                            <Image src={cart.cartItems[0].image} alt={cart.cartItems[0].name} fluid rounded />
                                            </div>
                                        </Col>                                            
                                        </Row>
                                        </ListGroup.Item>
                                        </ListGroup>
                                        )}
                    </ListGroup>
                        


                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                             
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>

                     
                        </ListGroup>
                    </Col>

                <Col md={12} className='text-center'>
                <Card>
                    <ListGroup variant='flush'>
 
                        <ListGroup.Item>
                            <Row>
                                <Col>Item Price:</Col>
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        {error && <Message variant='danger'>{error}</Message>}
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cart.cartItems.length === 0}
                                onClick={placeOrder}
                            >
                                Buy Now!
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </Container>
)
}

export default PlaceOrderScreen