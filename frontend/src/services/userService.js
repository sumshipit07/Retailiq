import axios from "axios";

const getStores = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        "https://retailiq-thru.onrender.com/api/user/stores",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export {
    getStores,
};