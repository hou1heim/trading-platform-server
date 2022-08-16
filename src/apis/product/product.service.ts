import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Image } from '../image/entities/image.entity';
import { ImageService } from '../image/image.service';
import { User } from '../user/entities/user.entity';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly imageService: ImageService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  async create({ createProductInput }) {
    const { userId, categories, images, name, ...product } = createProductInput;
    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
    });

    const categoryList = await Promise.all(
      categories.map((element) => {
        return this.categoryRepository.findOne({ where: { id: element } });
      }),
    );

    const imgList = await Promise.all(
      images.map((element) => {
        return this.imageRepository.findOne({ where: { src: element } });
      }),
    );

    const newProduct = this.productRepository.save({
      ...product,
      name,
      uploadDate: new Date(),
      isSoldOut: false,
      user: userInfo,
      categories: categoryList,
      images: imgList,
    });

    return newProduct;
  }

  async update({ productId, updateProductInput }) {
    const { images, ...updatedInfo } = updateProductInput;
    const imagesFound = await this.imageRepository.find({
      where: { product: productId },
    });
    console.log(imagesFound);
    await Promise.all(
      imagesFound.map((element) => {
        return this.imageService.delete({ imageId: element.id });
      }),
    );
    const newImgList = await Promise.all(
      images.map((element) => {
        return this.imageRepository.findOne({ where: { src: element } });
      }),
    );
    const result = await this.productRepository.save({
      ...updatedInfo,
      id: productId,
      images: newImgList,
    });
    return result;
  }

  async delete({ productId }) {
    const result = await this.productRepository.softDelete({ id: productId });
    return result.affected ? true : false;
  }

  async findDeletedAll() {
    const result = await this.productRepository.find({
      withDeleted: true,
    });
    return result;
  }

  async restore({ productId }) {
    const result = await this.productRepository.update(
      { id: productId },
      { withDeleted: null },
    );
    return result.affected ? true : false;
  }

  async findAll({ search }) {
    let searchResults : any = await this.cacheManager.get(search);
    let results = [];
    if (!searchResults) {
      let idList = await this.elasticsearchService.search({
        index: "myproducts",
        body: {
          query: {
            match: { "name": search }
          },
          fields: ["id", "name", "description"]
        }
      })
      for (let hit of idList.body.hits.hits) results.push(hit.fields.id[0])
      searchResults = await Promise.all(
        results.map((element)=> {
          return this.productRepository.findOne({
            where: { id: element },
            relations: ['user', 'payment', 'categories']})
        })
      )
      await this.cacheManager.set(search, searchResults, {
        ttl: 1200
      })
      return searchResults;
    }
    return searchResults;
  }

  async findOne({ productId }) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user', 'payment', 'categories'],
    });
    return product;
  }
}
