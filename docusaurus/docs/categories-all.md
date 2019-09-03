---
id: categories-all
title: Retrive All Categories
sidebar_label: All Categories
---

To get a list of all categories you can execute the follow query:

```graphql
query {
  allCategories {
    id
    title
    slug
    description
    parent {
      id
      title
    }
    image {
      id
      variants {
        name
        path
        width
        height
      }
    }
    createdAt
    updatedAt
  }
}
```

# Reference

You can see the full list of fields in [Get Category](categories-get.md#reference) docs.
