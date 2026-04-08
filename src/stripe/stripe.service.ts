import { Injectable } from '@nestjs/common';
import StripeImport from 'stripe';
import { ConfigService } from '@nestjs/config';

const Stripe = StripeImport as any;

@Injectable()
export class StripeService {
  private readonly stripe: any;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY não definida');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createProduct(name: string) {
    return this.stripe.products.create({ name });
  }

  async createPrice(productId: string, price: number) {
    return this.stripe.prices.create({
      product: productId,
      unit_amount: price,
      currency: 'brl',
    });
  }
}