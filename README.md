# Ritmo — cronograma de estudos

Aplicação em português para cadastrar matérias, definir metas semanais em minutos e registrar sessões de estudo. O painel soma o progresso de segunda a domingo no fuso horário do navegador. Os dados ficam no localStorage: não há conta, sincronização ou backend.

## Executar

Requisitos: Python 3 e Node.js 18 ou superior (para testes). Nenhuma dependência externa.

```sh
cd /workspace/cronograma-
npm start
```

O servidor usa a porta 3000. Para validar a lógica de progresso e persistência:

```sh
npm test
```

Remover uma matéria também remove suas sessões, após confirmação. Limpar os dados do navegador apaga os registros. O servidor Python serve apenas ao desenvolvimento.
