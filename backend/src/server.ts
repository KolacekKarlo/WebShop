import express, { Request, Response } from 'express';
import cors from 'cors';
import { products } from './data';
import { Product, OrderData, ApiResponse } from './types';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/products - Dohvaćanje svih proizvoda
app.get('/api/products', (req: Request, res: Response<ApiResponse<Product[]>>) => {
  try {
    // Simuliraj delay za testiranje loading stanja
    setTimeout(() => {
      res.json({
        success: true,
        data: products
      });
    }, 500);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Greška pri dohvaćanju proizvoda'
    });
  }
});

// GET /api/products/:id - Dohvaćanje jednog proizvoda
app.get('/api/products/:id', (req: Request, res: Response<ApiResponse<Product>>) => {
  try {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Proizvod nije pronađen'
      });
      return;
    }

    setTimeout(() => {
      res.json({
        success: true,
        data: product
      });
    }, 300);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Greška pri dohvaćanju proizvoda'
    });
  }
});

// GET /api/products/category/:category - Filtriranje po kategoriji
app.get('/api/products/category/:category', (req: Request, res: Response<ApiResponse<Product[]>>) => {
  try {
    const category = req.params.category;
    const filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );

    setTimeout(() => {
      res.json({
        success: true,
        data: filteredProducts
      });
    }, 400);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Greška pri filtriranju proizvoda'
    });
  }
});

// GET /api/categories - Dohvaćanje svih kategorija
app.get('/api/categories', (req: Request, res: Response<ApiResponse<string[]>>) => {
  try {
    const categories = Array.from(new Set(products.map(p => p.category)));
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Greška pri dohvaćanju kategorija'
    });
  }
});

// GET /api/featured - Dohvaćanje izdvojenih proizvoda
app.get('/api/featured', (req: Request, res: Response<ApiResponse<Product[]>>) => {
  try {
    const featuredProducts = products.filter(p => p.featured);
    
    setTimeout(() => {
      res.json({
        success: true,
        data: featuredProducts
      });
    }, 300);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Greška pri dohvaćanju izdvojenih proizvoda'
    });
  }
});

// POST /api/order - Kreiranje narudžbe
app.post('/api/order', (req: Request, res: Response<ApiResponse<{ orderId: string }>>) => {
  try {
    const orderData: OrderData = req.body;
    
    // Validacija
    if (!orderData.firstName || !orderData.lastName || !orderData.email) {
      res.status(400).json({
        success: false,
        error: 'Nedostaju obavezni podaci'
      });
      return;
    }

    if (!orderData.items || orderData.items.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Košarica je prazna'
      });
      return;
    }

    // Provjera zaliha
    for (const item of orderData.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          error: `Nedovoljna zaliha za proizvod: ${product?.name || item.productId}`
        });
        return;
      }
    }

    // Simuliraj delay za testiranje
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({
        success: true,
        data: { orderId }
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Greška pri obradi narudžbe'
    });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
  console.log(`API dostupan na http://localhost:${PORT}/api`);
});
