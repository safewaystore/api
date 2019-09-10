import { registerEnumType } from 'type-graphql';

export enum Status {
  published = 'published',
  draft = 'draft',
}

registerEnumType(Status, {
  name: 'Status',
  description: 'Product Status',
});
