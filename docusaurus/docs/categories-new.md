---
id: categories-new
title: Create a New Category
sidebar_label: New Category
---

To create a new category you can execute the follow mutation:

```graphql
mutation($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    title
    slug
    description
  }
}
```

## `CreateCategoryInput!`

A full list of all fields you can send in the mutation:

- `title: String!`
- `description: String`
- `image: Upload`
- `slug: String!`
- `parentId: ID`

# Reference

You can see the full list of fields in [Get Category](categories-get.md#reference) docs.
