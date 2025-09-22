import shopStore from "@/store/shopStore";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ShopListCard1({ data }) {
  const addToCart = shopStore((state) => state.addToCart);
  const products = shopStore((state) => state.products);

  const navigate = useNavigate();

  // handler
  const addToCartHandler = (product) => {
    addToCart(product);
    navigate("/shop-cart");
  };

  const isAdded = products.some((product) => product.id === data.id);

  return (
    <>
      <div className="shop-item text-center">
        <div className="thumb">
          <Link to={`/shop-single/${data.id}`}>
            <img
              className="w-100 w-100 object-fit-cover"
              src={data.img}
              alt="product"
            />
          </Link>
        </div>
        <div className="details">
          <p className="mb10">{data.shortTitle}</p>
          <h5 className="mb10">{data.brandInfo}</h5>
          <h5 className="mb20">${data.price.toFixed(2)}</h5>
          <a
            onClick={() => addToCartHandler(data)}
            className={`ud-btn ${isAdded ? "btn-thm2" : "btn-light-thm"}`}
          >
            {isAdded ? "Added Cart" : "Add to cart"}
            <i className="fal fa-arrow-right-long" />
          </a>
        </div>
      </div>
    </>
  );
}
