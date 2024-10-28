import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import { cartReducer } from './reducers/cartReducers';
import {
    userLoginReducers,
    userRegisterReducers,
    userDetailsReducer,
    userUpdateProfileReducer,
    userListReducer,
    userDeleteReducer,
    userUpdateReducer,
} from './reducers/userReducers'

import {
    orderCreateReducer,
    orderDetailsReducer,
    orderPayReducer,
    orderListMyReducer,
    orderListReducer,
    orderDeliverReducer,
} from './reducers/orderReducers'

import {
    productListReducers,
    productDetailsReducers,
    productDeleteReducer,
    productCreateReducer,
    productUpdateReducer,
    productReviewCreateReducer,
    productTopRatedReducer,
} from './reducers/productReducers'

import {
    doctorListReducer,
    doctorDetailReducer,
    doctorCreateReducer,
    doctorUpdateReducer,
    doctorDeleteReducer,
    doctorReviewCreateReducer,
    doctorReviewsReducer ,
} from './reducers/doctorReducers';

import { appointmentCreateReducer,
    appointmentListReducer,
    appointmentDetailsReducer,
    appointmentPayReducer,
    appointmentReviewReducer,
    appointmentReducer ,
 } from './reducers/appointmentReducer';

 import { searchReducer } from './reducers/searchReducers';


const reducer = combineReducers({
    cart:cartReducer,
    appointmentDetails: appointmentDetailsReducer,
    appointmentCreate: appointmentCreateReducer,
    appointmentList: appointmentListReducer,
    appointmentPay: appointmentPayReducer,
    appointmentReview: appointmentReviewReducer,
    appointment: appointmentReducer,
    searchResults: searchReducer,

    doctorReviews: doctorReviewsReducer ,
    doctorList: doctorListReducer,
    doctorDetail: doctorDetailReducer,
    doctorCreate: doctorCreateReducer,
    doctorUpdate: doctorUpdateReducer,
    doctorDelete: doctorDeleteReducer,
    doctorReviewCreate: doctorReviewCreateReducer,

    userLogin:userLoginReducers,
    userRegister:userRegisterReducers,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    productList: productListReducers,
    productDetails: productDetailsReducers,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
})


const cartItemsFromStorage = localStorage.getItem('cartItems')?
JSON.parse(localStorage.getItem('cartItems')): []

const userInfoFromStorage = localStorage.getItem('userInfo')?
JSON.parse(localStorage.getItem('userInfo')): null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initailState = {
    cart:{cartItems:cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,

    },
    userLogin:{userInfo:userInfoFromStorage},
}

const middleware=[thunk]
const store = createStore(reducer,initailState,composeWithDevTools(applyMiddleware(...middleware)))

export default store;