import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { OrderFormData, FormErrors } from '../types';
import { Container, Button, Card, Input, ErrorMessage } from '../styles/components';

const PageTitle = styled.h1`
  font-size: 42px;
  margin: 40px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 32px;
    margin: 24px 0;
  }
`;

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 60px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--text-dark);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
`;

const Summary = styled(Card)`
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  gap: 12px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
`;

const ItemQuantity = styled.span`
  font-size: 13px;
  color: var(--text-light);
`;

const ItemPrice = styled.span`
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  font-size: 24px;
  font-weight: 700;
`;

const TotalValue = styled.span`
  color: var(--primary);
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  font-size: 18px;
`;

const SuccessMessage = styled.div`
  background: #E5F9F0;
  border: 2px solid var(--success);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  margin: 40px 0;
`;

const SuccessTitle = styled.h2`
  color: var(--success);
  font-size: 32px;
  margin-bottom: 16px;
`;

const OrderId = styled.p`
  font-size: 18px;
  margin: 16px 0;
  font-weight: 600;
  color: var(--text-dark);
`;

const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<string>('');

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? 'Ovo polje je obavezno' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Unesite ispravnu email adresu' : '';
      case 'address':
        return value.trim().length < 5 ? 'Adresa mora imati najmanje 5 znakova' : '';
      case 'city':
        return value.trim() === '' ? 'Grad je obavezan' : '';
      case 'zipCode':
        const zipRegex = /^\d{5}$/;
        return !zipRegex.test(value) ? 'Poštanski broj mora imati 5 brojeva' : '';
      case 'cardNumber':
        const cardRegex = /^\d{16}$/;
        return !cardRegex.test(value.replace(/\s/g, '')) 
          ? 'Broj kartice mora imati 16 brojeva' : '';
      case 'cardExpiry':
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) {
          return 'Format: MM/GG';
        }
        const [month, year] = value.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          return 'Kartica je istekla';
        }
        return '';
      case 'cardCvv':
        const cvvRegex = /^\d{3}$/;
        return !cvvRegex.test(value) ? 'CVV mora imati 3 broja' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof OrderFormData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = await api.createOrder(formData, cart);
      setOrderSuccess(orderId);
      clearCart();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Greška pri obradi narudžbe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    navigate('/kosarica');
    return null;
  }

  if (orderSuccess) {
    return (
      <Container>
        <SuccessMessage>
          <SuccessTitle>✓ Narudžba uspješno zaprimljena!</SuccessTitle>
          <OrderId>Broj narudžbe: {orderSuccess}</OrderId>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
            Zahvaljujemo na kupovini! Detalje narudžbe poslali smo na vašu email adresu.
          </p>
          <Button onClick={() => navigate('/proizvodi')}>
            Nastavi kupovinu
          </Button>
        </SuccessMessage>
      </Container>
    );
  }

  const total = getCartTotal();

  return (
    <Container>
      <PageTitle>Naplata</PageTitle>

      <CheckoutLayout>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Podaci za dostavu</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">Ime *</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Marko"
                />
                {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="lastName">Prezime *</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Marković"
                />
                {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="marko@example.com"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="address">Adresa *</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ulica i broj"
              />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label htmlFor="city">Grad *</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Zagreb"
                />
                {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="zipCode">Poštanski broj *</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10000"
                  maxLength={5}
                />
                {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
              </FormGroup>
            </FormRow>
          </Section>

          <Section>
            <SectionTitle>Podaci o plaćanju</SectionTitle>
            <FormGroup>
              <Label htmlFor="cardNumber">Broj kartice *</Label>
              <Input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label htmlFor="cardExpiry">Datum isteka *</Label>
                <Input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/GG"
                  maxLength={5}
                />
                {errors.cardExpiry && <ErrorMessage>{errors.cardExpiry}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="cardCvv">CVV *</Label>
                <Input
                  type="text"
                  id="cardCvv"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={3}
                />
                {errors.cardCvv && <ErrorMessage>{errors.cardCvv}</ErrorMessage>}
              </FormGroup>
            </FormRow>
          </Section>
        </Form>

        <Summary>
          <SummaryTitle>Vaša narudžba</SummaryTitle>
          {cart.map(item => (
            <CartItem key={item.product.id}>
              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemQuantity>Količina: {item.quantity}</ItemQuantity>
              </ItemInfo>
              <ItemPrice>{(item.product.price * item.quantity).toFixed(2)} €</ItemPrice>
            </CartItem>
          ))}
          <TotalRow>
            <span>Ukupno:</span>
            <TotalValue>{total.toFixed(2)} €</TotalValue>
          </TotalRow>
          <SubmitButton type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Obrada...' : 'Potvrdi narudžbu'}
          </SubmitButton>
        </Summary>
      </CheckoutLayout>
    </Container>
  );
};

export default Checkout;
