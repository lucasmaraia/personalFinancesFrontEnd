# personalFinancesFrontEnd

Interface web para o controle de finanças pessoais: formulário de lançamento, lista de transações e gráfico da evolução dos valores.

> Projeto de estudo (julho/2024), escrito em JavaScript puro, sem framework nem build step, para praticar `fetch`, `async/await` e manipulação direta do DOM. Consome a API [personalFinancesBackEnd](https://github.com/lucasmaraia/personalFinancesBackEnd).

## Stack

- HTML, CSS e JavaScript (sem framework)
- Chart.js (gráfico)
- jQuery Toast (notificações)

## Estrutura

```
index.html          → formulário, lista de transações e canvas do gráfico
js/script.js        → chamadas à API, renderização da lista e do gráfico
js/jquery.toast.js  → plugin de notificação
css/styles.css      → estilos
assets/             → ícone
```

## Como rodar

1. Suba a API ([personalFinancesBackEnd](https://github.com/lucasmaraia/personalFinancesBackEnd)) em `http://localhost:8080`.
2. Sirva esta pasta por HTTP. Abrir o `index.html` direto do disco (`file://`) faz o navegador bloquear as requisições por CORS:

```bash
python -m http.server 5500
```

3. Acesse <http://localhost:5500>.

A URL da API está no topo de `js/script.js`:

```js
const baseUrl = 'http://localhost:8080';
```

## Funcionalidades

- Lançar uma transação (descrição, valor e data)
- Listar as transações existentes
- Remover uma transação
- Visualizar o gráfico, atualizado a cada alteração
- Toast de confirmação após cada lançamento

## Limitações

Sem validação de formulário além do `required` do HTML, sem tratamento de erro visível para o usuário (as falhas vão só para o `console`) e sem paginação da lista.
