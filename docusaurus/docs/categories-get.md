---
id: categories-get
title: Get a Single Category
sidebar_label: Get Category
---

To get a single category you execute the follow query:

```graphql
query($id: String!) {
  getCategory(id: $id) {
    id
    title
    slug
  }
}
```

## Reference

### `Fields`

A full list of all fields you can get in the query:

- `id: ID`
- `title: String!`
- `description: String`
- `image: Image` [reference](#image)
- `created_at: DateTime!`
- `updated_at: DateTime!`

### `Image`

- `id: string!`
- `variants: Variant!` [reference](#variant)

### `Variant`

- `name: string!`
- `path: string!`
- `width: number!`
- `height: number!`
