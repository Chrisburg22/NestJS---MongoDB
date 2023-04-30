import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll() {
    return await this.productModel.find().exec();
  }

  async findOne(id:string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

 async create(data: CreateProductDto) {
   const newProduct = new this.productModel(data);
   return await newProduct.save();
 }

  async update(id: string, changes: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, {$set: changes}, { new: true } )
      .exec();
    if(!product){
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id)
  }
}
