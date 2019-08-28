export class EmailUniqueError extends Error {
  constructor() {
    super('Email já cadastrado no sistema.');
  }
}

export class UserNotFound extends Error {
  constructor() {
    super('Usuário não encontrado.');
  }
}

export class UserIncorrect extends Error {
  constructor() {
    super('Usuário ou senha incorreta.');
  }
}

export class CategoryNotFound extends Error {
  constructor() {
    super('Categoria não encontrada.');
  }
}
