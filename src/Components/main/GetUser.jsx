import React from 'react';
import Axios from 'axios';

export const GetUser = () => {
        return (Axios.post(
            `http://localhost:8080/api/user`,
            JSON.parse(localStorage.getItem('user'))
        ))
}
