import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';

const HeaderWrapper = styled.header`
  background: var(--bg-white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const NavLink = styled(Link)`
  font-weight: 600;
  color: var(--text-dark);
  position: relative;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const CartLink = styled(Link)`
  position: relative;
  font-weight: 600;
  color: var(--text-dark);
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -12px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;

const Header: React.FC = () => {
  const { getCartItemsCount } = useCart();
  const itemsCount = getCartItemsCount();

  return (
    <HeaderWrapper>
      <Nav>
        <Logo to="/">KarloShop</Logo>
        <NavLinks>
          <NavLink to="/">Početna</NavLink>
          <NavLink to="/proizvodi">Proizvodi</NavLink>
          <CartLink to="/kosarica">
            Košarica
            {itemsCount > 0 && <CartBadge>{itemsCount}</CartBadge>}
          </CartLink>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
