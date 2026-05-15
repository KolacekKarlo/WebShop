import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { api } from '../services/api';
import { Container, Button, Grid, Card } from '../styles/components';

const Hero = styled.section`
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    padding: 60px 20px;
    margin-bottom: 40px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  margin-bottom: 16px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Section = styled.section`
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  margin-bottom: 32px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 24px;
  }
`;

const ProductCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--text-dark);
`;

const ProductPrice = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 16px;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 16px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchFeaturedProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        const products = await api.getFeaturedProducts();
        setFeaturedProducts(products);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Greška pri učitavanju');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Hero>
        <Container>
          <HeroTitle>Dobrodošli u KarloShop</HeroTitle>
          <HeroSubtitle>Još jedan ne kreativan webshop</HeroSubtitle>
          <Link to="/proizvodi">
            <Button>Pogledaj sve proizvode</Button>
          </Link>
        </Container>
      </Hero>

      <Container>
        <Section>
          <SectionTitle>Izdvojeni proizvodi</SectionTitle>
          
          {!loading && !error && (
            <Grid columns={3}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id}>
                  <ProductImage src={product.image} alt={product.name} />
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price.toFixed(2)} €</ProductPrice>
                  <ProductDescription>{product.description}</ProductDescription>
                  <Link to={`/proizvodi/${product.id}`}>
                    <Button variant="outline">Pogledaj detalje</Button>
                  </Link>
                </ProductCard>
              ))}
            </Grid>
          )}
        </Section>
      </Container>
    </>
  );
};

export default Home;
