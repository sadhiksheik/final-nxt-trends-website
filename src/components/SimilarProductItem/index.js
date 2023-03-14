// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {title, brand, price, rating, imageUrl} = details

  return (
    <ul className="ul-similar-item">
      <img
        src={imageUrl}
        alt="similar product {product title}"
        className="similar-image"
      />
      <h1 className="name">{title}</h1>
      <p className="brand">by {brand}</p>
      <dic className="price-rating-container">
        <p className="name">Rs {price}/-</p>
        <div className="star-rating">
          <p className="rate">{rating}</p>
          <img
            className="rate-star"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </div>
      </dic>
    </ul>
  )
}
export default SimilarProductItem
