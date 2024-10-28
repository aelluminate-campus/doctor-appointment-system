import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
} from '../constants/orderConstants';

import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import axiosInstance from '../actions/axiosInstance';

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const { data } = await axiosInstance.post(
            `/api/orders/add/`,
            order
        );

        console.log("Response Data:", data);

        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
        dispatch({ type: CART_CLEAR_ITEMS, payload: data });
        localStorage.removeItem('cartItems');

    } catch (error) {
        console.error("Error in createOrder:", error);
        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Response Status:", error.response.status);
            console.error("Response Headers:", error.response.headers);
        }

        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const { data } = await axiosInstance.get(`/api/orders/${id}/`);

        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const payOrder = (id, paymentResult) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST });

        const { data } = await axiosInstance.put(
            `/api/orders/${id}/pay/`,
            paymentResult
        );

        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const deliverOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DELIVER_REQUEST });

        const { data } = await axiosInstance.put(
            `/api/orders/${order._id}/deliver/`,
            {}
        );

        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const listMyOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ORDER_LIST_MY_REQUEST });

        const { data } = await axiosInstance.get('/api/orders/myorders/');

        dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};

export const listOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ORDER_LIST_REQUEST });

        const { data } = await axiosInstance.get('/api/orders/');

        dispatch({ type: ORDER_LIST_SUCCESS, payload: data });

    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
};
