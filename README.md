# Dietas Backend API

API responsável por gerar planos alimentares semanais via IA, com validação de entrada e resposta em streaming.

## Tecnologias utilizadas

- Node.js + TypeScript
- Fastify 5
- @fastify/cors
- Zod 4 (validação de payload)
- OpenAI SDK (streaming de resposta)
- tsx (execução em desenvolvimento)

## Funcionalidades da API

- Validação do corpo da requisição com schema tipado (`DietPlanRequestSchema`)
- Geração de plano alimentar com IA a partir de prompts estruturados
- Streaming de resposta para o cliente (`text/event-stream`)
- Leitura de base de conhecimento local em `knowledge/guidelines.md`
- Endpoint de health check básico (`GET /`)

## Estrutura principal

- `src/server.ts`: inicialização do servidor Fastify e registro de rotas
- `src/routes/plan.ts`: endpoint `POST /plan` com validação + streaming
- `src/types.ts`: contrato de entrada da API (Zod + tipo inferido)
- `src/agent.ts`: integração com OpenAI e geração incremental da resposta
- `src/prompt.ts`: construção de prompts de sistema e usuário

## Pré-requisitos

- Node.js 18+
- Variável de ambiente `OPENAI_API_KEY`

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
OPENAI_API_KEY=sua_chave_aqui
PORT=3333
```

> `PORT` é opcional. Se não for informado, a API usa `3333`.

## Executar em desenvolvimento

```bash
npm run dev
```

Servidor padrão: `http://localhost:3333`

## Endpoints

### `GET /`

Retorna uma mensagem simples para verificar se a API está no ar.

Resposta exemplo:

```text
Hello, World!
```

### `POST /plan`

Gera plano de dieta em streaming.

Headers de resposta:

- `Content-Type: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`
- `Access-Control-Allow-Origin: *`

#### Payload esperado

```json
{
  "nome": "Roger",
  "idade": 29,
  "altura_cm": 175,
  "peso_kg": 78,
  "sexo": "masculino",
  "nivel_atividade": "3x_semana",
  "objetivo": "hipertrofia"
}
```

Valores aceitos:

- `sexo`: `masculino` | `feminino`
- `nivel_atividade`: `sedentario` | `2x_semana` | `3x_semana` | `4x_semana` | `5x_semana` | `diario`
- `objetivo`: `perda_de_peso` | `hipertrofia` | `manter_massa_muscular`

#### Exemplo com cURL (streaming)

```bash
curl -N -X POST http://localhost:3333/plan \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Roger",
    "idade": 29,
    "altura_cm": 175,
    "peso_kg": 78,
    "sexo": "masculino",
    "nivel_atividade": "3x_semana",
    "objetivo": "hipertrofia"
  }'
```

## Erros de validação

Quando o payload não respeita o schema, a API responde com `400`:

```json
{
  "error": "ValidationError",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "objetivo": ["Invalid option: expected one of ..."]
    }
  }
}
```

## Observações

- O backend usa o modelo `gpt-4o-mini` atualmente.
- O conteúdo de `knowledge/guidelines.md` influencia diretamente o estilo e regras da dieta gerada.
