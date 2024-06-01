import axios from "axios";

export const fetchProductsFromCompany = async (company, categoryname, top, minPrice, maxPrice, authToken) => {
    const url = `${process.env.BASE_URL}/AMZ/categories/${categoryname}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${precess.env.AUTH_TOKEN}`
        }
    });
    return response.data;
};
