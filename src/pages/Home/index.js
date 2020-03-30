import React, { Component } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import { formatPrice } from '../../util/format';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, IsLoading } from './styles';

class Home extends Component {
  state = {
    products: [],
    loading: true,
  };

  async componentDidMount() {
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data, loading: false });
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  render() {
    const { products, loading } = this.state;
    const { amount } = this.props;
    return (
      <>
        {loading ? (
          <IsLoading loading={loading}>
            <FaSpinner color="#FFF" size={70} />
          </IsLoading>
        ) : (
          <ProductList>
            {products.map(product => (
              <li key={product.id}>
                <img src={product.image} alt={product.title} />
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>

                <button
                  onClick={() => this.handleAddProduct(product.id)}
                  type="button"
                >
                  <div>
                    <MdAddShoppingCart size={16} color="#fff" />{' '}
                    {amount[product.id] || 0}
                  </div>

                  <span>ADICIONAR AO CARRINHO</span>
                </button>
              </li>
            ))}
          </ProductList>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
