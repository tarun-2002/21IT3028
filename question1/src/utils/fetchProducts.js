import axios from "axios";

export const fetchProductsFromCompany = async (company, categoryname, top, minPrice, maxPrice, authToken) => {
    const url = `${process.env.BASE_URL}${company}/categories/${categoryname}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
console.log(url)
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
        throw error;
    }
};
