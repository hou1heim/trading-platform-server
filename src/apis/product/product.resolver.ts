import { UnprocessableEntityException } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productService.create({ createProductInput });
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('productId') productId: string) {
    return this.productService.delete({ productId });
  }

  @Mutation(() => Boolean)
  restoreProduct(@Args('productId') productId: string) {
    return this.productService.restore({ productId });
  }

  @Query(() => [Product])
  fetchProductsWithDeleted() {
    return this.productService.findDeletedAll();
  }

  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string) {
    return this.productService.findOne({ productId });
  }

  @Query(() => [Product])
  fetchProducts(
    @Args('search') search: string
  ) {
    return this.productService.findAll({ search });
  }
}
