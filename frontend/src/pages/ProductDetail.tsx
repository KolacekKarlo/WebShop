import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { Container, Button, Badge } from '../styles/components';

const DetailContainer = styled.div`
  margin: 60px 0;

  @media (max-width: 768px) {
    margin: 40px 0;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 100px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Category = styled.span`
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
`;

const ProductTitle = styled.h1`
  font-size: 48px;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Price = styled.div`
  font-size: 42px;
  font-weight: 800;
  color: var(--primary);

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-light);
`;

const StockSection = styled.div`
  padding: 20px;
  background: var(--bg-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-light);
  color: var(--text-dark);
  font-size: 20px;
  font-weight: 700;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 24px;
  font-weight: 700;
  min-width: 40px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const BackButton = styled(Button)`
  margin-bottom: 24px;
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await api.getProductById(parseInt(id));
        setProduct(productData);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Greška pri učitavanju proizvoda');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (): void => {
    if (product && product.stock >= quantity) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = (): void => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = (): void => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return <Container><DetailContainer>cekaj</DetailContainer></Container>;
  }

  if (error) {
    return <Container><DetailContainer>{error}</DetailContainer></Container>;
  }

  if (!product) {
    return <Container><DetailContainer>nema</DetailContainer></Container>;
  }

  return (
    <Container>
      <DetailContainer>
        <BackButton variant="outline" onClick={() => navigate(-1)}>
          ← Nazad
        </BackButton>

        <ProductLayout>
          <ImageSection>
            <ProductImage src={product.image} alt={product.name} />
          </ImageSection>

          <InfoSection>
            <Category>{product.category}</Category>
            <ProductTitle>{product.name}</ProductTitle>
            <Price>{product.price.toFixed(2)} €</Price>
            <Description>{product.description}</Description>

            <StockSection>
              {product.stock > 0 ? (
                <>
                  <Badge variant="success">Dostupno</Badge>
                  <span>Na stanju: {product.stock} komada</span>
                </>
              ) : (
                <Badge variant="error">Trenutno nije dostupno</Badge>
              )}
            </StockSection>

            {product.stock > 0 && (
              <>
                <QuantitySelector>
                  <span style={{ fontWeight: 600 }}>Količina:</span>
                  <QuantityButton onClick={decrementQuantity} disabled={quantity <= 1}>
                    -
                  </QuantityButton>
                  <QuantityDisplay>{quantity}</QuantityDisplay>
                  <QuantityButton onClick={incrementQuantity} disabled={quantity >= product.stock}>
                    +
                  </QuantityButton>
                </QuantitySelector>

                <ButtonGroup>
                  <Button onClick={handleAddToCart} disabled={addedToCart}>
                    {addedToCart ? '✓ Dodano u košaricu' : 'Dodaj u košaricu'}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/kosarica')}>
                    Idi u košaricu
                  </Button>
                </ButtonGroup>
              </>
            )}
          </InfoSection>
        </ProductLayout>
      </DetailContainer>
    </Container>
  );
};

export default ProductDetail;
