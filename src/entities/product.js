import awsExports from '../aws-exports';
export default class Product {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.prodFullName;
    this.categoryName = obj.prodCategory;
    this.imageSrc = obj.imageFile
      ? `${awsExports.aws_s3_imagesUrl}/product/${obj.imageFile}`
      : null;
    // this.description = obj.prodName;
    // this.longDescription = obj.prodName;
    // this.region = obj.region;
    this.region = obj.prodMinor;
    this.abv = obj.abv;
    this.price = '$99.00';
    this.rating = '5';
    this.reviewCount = '9999';
    this.brandLine = obj.brandLine;
    this.manufacturer = obj.manufacturer;
    // this.seoName = '';
    this.redirectUrl = `/product/${this.id}`;
  }
}
