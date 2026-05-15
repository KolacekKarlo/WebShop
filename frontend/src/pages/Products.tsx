import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { api } from '../services/api';
import { Container, Button, Grid, Card, Input, Badge } from '../styles/components';

const PageTitle = styled.h1`
  font-size: 42px;
  margin: 40px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 24px 0;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 24px;
  }
`;

const SearchInput = styled(Input)`
  flex: 1;
  min-width: 250px;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
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

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  color: var(--text-dark);
  flex: 1;
`;

const ProductPrice = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
`;

const ProductCategory = styled.span`
  font-size: 12px;
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 16px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StockInfo = styled.div`
  margin-bottom: 16px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
  font-size: 18px;
`;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Greška pri učitavanju');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  return (
    <Container>
      <PageTitle>Naši proizvodi</PageTitle>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Slike su uzete s unsplash.com..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
        >
          <option value="">Sve kategorije</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
      </FiltersContainer>

      {!loading && !error && filteredProducts.length === 0 && (
        <NoResults>
          Nema takvog proizvoda.
        </NoResults>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <Grid columns={3}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductCategory>{product.category}</ProductCategory>
              <ProductHeader>
                <ProductName>{product.name}</ProductName>
              </ProductHeader>
              <ProductPrice>{product.price.toFixed(2)} €</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
              <StockInfo>
                {product.stock > 0 ? (
                  <Badge variant="success">Na stanju: {product.stock}</Badge>
                ) : (
                  <Badge variant="error">Nema na stanju</Badge>
                )}
              </StockInfo>
              <Link to={`/proizvodi/${product.id}`}>
                <Button variant="outline">Pogledaj detalje</Button>
              </Link>
            </ProductCard>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Products;
