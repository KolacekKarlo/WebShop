import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { Container, Button, Card } from '../styles/components';

const PageTitle = styled.h1`
  font-size: 42px;
  margin: 40px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 24px 0;
  }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 60px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartItem = styled(Card)`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 80px 1fr;
    gap: 12px;
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 640px) {
    width: 80px;
    height: 80px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemName = styled.h3`
  font-size: 18px;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const ItemPrice = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;

  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;

  @media (max-width: 640px) {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--bg-light);
  color: var(--text-dark);
  font-size: 16px;
  font-weight: 700;
`;

const QuantityDisplay = styled.span`
  font-size: 18px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled.button`
  color: var(--error);
  background: none;
  padding: 8px;
  font-size: 14px;
  font-weight: 600;
`;

const Summary = styled(Card)`
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
`;

const SummaryLabel = styled.span`
  color: var(--text-light);
`;

const SummaryValue = styled.span`
  font-weight: 600;
`;

const TotalRow = styled(SummaryRow)`
  border-bottom: none;
  padding-top: 20px;
  font-size: 24px;
  font-weight: 700;
`;

const TotalValue = styled(SummaryValue)`
  color: var(--primary);
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  font-size: 18px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;
`;

const EmptyCartTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 16px;
  color: var(--text-light);
`;

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container>
        <PageTitle>Košarica</PageTitle>
        <EmptyCart>
          <EmptyCartTitle>Vaša košarica je prazna</EmptyCartTitle>
          <p style={{ marginBottom: '32px', color: 'var(--text-light)' }}>
            Dodajte proizvode u košaricu kako biste nastavili s kupovinom
          </p>
          <Link to="/proizvodi">
            <Button>Pregledaj proizvode</Button>
          </Link>
        </EmptyCart>
      </Container>
    );
  }

  const total = getCartTotal();

  return (
    <Container>
      <PageTitle>Košarica</PageTitle>

      <CartLayout>
        <CartItems>
          {cart.map(item => (
            <CartItem key={item.product.id}>
              <ItemImage src={item.product.image} alt={item.product.name} />
              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemPrice>{item.product.price.toFixed(2)} €</ItemPrice>
                <span style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                  Ukupno: {(item.product.price * item.quantity).toFixed(2)} €
                </span>
              </ItemInfo>
              <ItemActions>
                <QuantityControl>
                  <QuantityButton
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </QuantityButton>
                </QuantityControl>
                <RemoveButton onClick={() => removeFromCart(item.product.id)}>
                  Ukloni
                </RemoveButton>
              </ItemActions>
            </CartItem>
          ))}
        </CartItems>

        <Summary>
          <SummaryTitle>Sažetak narudžbe</SummaryTitle>
          <SummaryRow>
            <SummaryLabel>Ukupno artikala:</SummaryLabel>
            <SummaryValue>{cart.reduce((sum, item) => sum + item.quantity, 0)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Međuzbroj:</SummaryLabel>
            <SummaryValue>{total.toFixed(2)} €</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Dostava:</SummaryLabel>
            <SummaryValue>Besplatna</SummaryValue>
          </SummaryRow>
          <TotalRow>
            <span>Ukupno:</span>
            <TotalValue>{total.toFixed(2)} €</TotalValue>
          </TotalRow>
          <CheckoutButton onClick={() => navigate('/naplata')}>
            Nastavi na naplatu
          </CheckoutButton>
        </Summary>
      </CartLayout>
    </Container>
  );
};

export default Cart;
