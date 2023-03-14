// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiUrlConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}
class ProductItemDetails extends Component {
  state = {
    apiResult: apiUrlConstants.initial,
    count: 1,
    detailsList: [],
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onReduceCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onIncreaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  getProductDetails = async () => {
    this.setState({apiResult: apiUrlConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      const formattedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }
      this.setState({
        detailsList: formattedData,
        apiResult: apiUrlConstants.success,
      })
    } else {
      this.setState({
        apiResult: apiUrlConstants.failure,
      })
    }
  }

  continueShoppingButton = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="details-bg">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1 className="failure-text">Product Not Found</h1>
      <button
        type="button"
        className="failure-btn"
        onClick={this.continueShoppingButton}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="details-bg">
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </div>
  )

  getFormattedSim = eachPro => {
    const formattedSimilarItems = {
      id: eachPro.id,
      imageUrl: eachPro.image_url,
      title: eachPro.title,
      style: eachPro.style,
      price: eachPro.price,
      description: eachPro.description,
      brand: eachPro.brand,
      totalReviews: eachPro.total_reviews,
      rating: eachPro.rating,
      availability: eachPro.availability,
    }
    return formattedSimilarItems
  }

  renderSuccessProducts = () => {
    const {detailsList, count} = this.state
    const {
      imageUrl,
      title,
      description,
      price,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = detailsList
    const formattedSimilars = similarProducts.map(eachPro =>
      this.getFormattedSim(eachPro),
    )
    return (
      <div className="details-bg">
        <div className="product-details">
          <img className="pro-img" alt="product" src={imageUrl} />
          <div className="pro-specify-container">
            <h1 className="main-heading">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  className="star"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="review">{totalReviews}</p>
            </div>
            <p className="description">{description}</p>
            <p className="price">Available: {availability}</p>
            <p className="price">Brand: {brand}</p>
            <div className="review-container">
              <button
                className="plus"
                type="button"
                data-testid="minus"
                onClick={this.onReduceCount}
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="price">{count}</p>
              <button
                className="plus"
                type="button"
                data-testid="plus"
                onClick={this.onIncreaseCount}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button className="failure-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <div className="sim-item-box">
          <ul className="ul-similar-container">
            {formattedSimilars.map(eachSimilar => (
              <SimilarProductItem key={eachSimilar.id} details={eachSimilar} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderResult = () => {
    const {apiResult} = this.state

    switch (apiResult) {
      case apiUrlConstants.success:
        return this.renderSuccessProducts()
      case apiUrlConstants.failure:
        return this.renderFailureView()
      case apiUrlConstants.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderResult()}
      </>
    )
  }
}
export default withRouter(ProductItemDetails)
