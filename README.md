# prototype-firmware-deployment-orchestrator

Protótipo de um orquestrador de atualização de firmware para redes de câmeras geograficamente distribuídas.

O sistema busca metadados de câmeras via Grafana, calcula um plano de rollout em ondas geográficas usando a fórmula de Haversine e exibe o resultado em um mapa interativo, permitindo staged deployments partindo de um ponto de origem em direção a regiões progressivamente mais distantes.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Módulos](#módulos)
- [API REST](#api-rest)
- [Algoritmo de Wave Planner](#algoritmo-de-wave-planner)
- [Dashboard](#dashboard)
- [Configuração e Execução](#configuração-e-execução)
- [Scripts](#scripts)
- [Status de Implementação](#status-de-implementação)

---

## Visão Geral

O orquestrador executa o seguinte fluxo principal:

```
Grafana API → PipelineService → WavePlannerService → Dashboard (Mapa + Tabela)
```

1. **Busca de câmeras** via API do Grafana (datasource query)
2. **Cálculo de distância** de cada câmera ao ponto de origem (HQ) usando a fórmula de Haversine
3. **Distribuição em ondas** com crescimento exponencial, do centro para a periferia
4. **Visualização** no dashboard com mapa Leaflet e tabela de execução por onda

---

## Arquitetura

```
src/
├── main.ts                     # Bootstrap da aplicação
├── logger.ts                   # Logger customizado com timestamp
├── app.module.ts               # Módulo raiz
└── modules/
    ├── dashboard/              # Controller HTTP + UI web (Leaflet)
    ├── api-grafana/            # Integração com datasource do Grafana
    ├── pipeline/               # Orquestração do fluxo de dados
    ├── wave-planner/           # Algoritmo de plano de rollout
    ├── api-camera/             # [Stub] Controle individual de câmeras
    ├── api-tunnels/            # [Stub] Gerenciamento de túneis SSH/VPN
    ├── api-bifrost/            # [Stub] Integração com serviço Bifrost
    ├── camera-discovery/       # [Stub] Descoberta de câmeras na rede
    └── firmware-updater/       # [Stub] Execução de atualização de firmware
```

---

## Módulos

### `dashboard`

Controller principal e interface web.

- Serve o HTML do dashboard com mapa interativo
- Expõe endpoints para leitura de câmeras e acionamento do pipeline
- Depende de `ApiGrafanaService` e `PipelineService`

### `api-grafana`

Integração com o datasource do Grafana para obtenção dos metadados das câmeras.

**CameraDataDto:**

| Campo                  | Tipo            | Descrição                        |
|------------------------|-----------------|----------------------------------|
| `IDPontoVisualizacao`  | `string`        | ID do ponto de visualização      |
| `IDCamera`             | `string`        | ID da câmera                     |
| `VersaoFirmware`       | `string \| null` | Versão atual do firmware         |
| `Latitude`             | `number`        | Coordenada geográfica            |
| `Longitude`            | `number`        | Coordenada geográfica            |

> No protótipo, os dados são servidos a partir do arquivo estático `response_clean.json`. O repositório está estruturado para integração real via `POST /api/ds/query`.

### `pipeline`

Orquestra o ciclo de atualização de dados em 3 etapas:

1. Busca câmeras atualizadas no Grafana (`refreshCameras`)
2. Envia para o `WavePlannerService` calcular o plano de rollout
3. Retorna câmeras enriquecidas com distância + plano completo

**PipelineResultDto:**

```typescript
{
  cameras: CameraWithDistanceDto[];  // Câmeras ordenadas por distância ao HQ
  plan: RolloutPlanDto;              // Plano de rollout em ondas
}
```

### `wave-planner`

Implementa o algoritmo central do sistema: distribuição geográfica exponencial de câmeras em ondas de deployment.

**Parâmetros de configuração (hardcoded no construtor):**

| Parâmetro       | Valor              | Descrição                                  |
|-----------------|--------------------|--------------------------------------------|
| Origem (HQ)     | -23.5641718, -46.6828659 | Ponto de partida do rollout (São Paulo) |
| `totalWaves`    | 7                  | Número de ondas                            |
| `daysPerWave`   | 2                  | Dias entre cada onda (14 dias no total)    |
| `alpha`         | 0.25               | Parâmetro de crescimento exponencial       |

### `api-camera` (Stub)

Interface para a API HTTP de câmeras individuais, com suporte a Digest Auth.

Endpoints previstos:

| Método | Endpoint                              | Descrição                        |
|--------|---------------------------------------|----------------------------------|
| POST   | `/API/Web/Login`                      | Autenticação                     |
| POST   | `/API/Login/Heartbeat`                | Manutenção de sessão             |
| POST   | `/API/Maintenance/FtpUpgrade/Set`     | Configurar fonte do firmware     |
| POST   | `/API/Maintenance/FtpUpgrade/Check`   | Verificar atualização disponível |
| POST   | `/API/Maintenance/TransKey/Get`       | Obter chave de criptografia      |
| POST   | `/API/Maintenance/FtpUpgrade/Upgrade` | Disparar upgrade                 |

---

## API REST

Base URL: `http://localhost:3000`

### `GET /dashboard`

Serve a interface web do dashboard.

---

### `GET /dashboard/cameras`

Retorna a lista de câmeras cacheada (última busca ao Grafana).

**Resposta:**
```json
[
  {
    "IDPontoVisualizacao": "string",
    "IDCamera": "string",
    "VersaoFirmware": "string | null",
    "Latitude": -23.5,
    "Longitude": -46.6
  }
]
```

---

### `POST /dashboard/refresh`

Executa o pipeline completo: busca câmeras no Grafana → calcula plano de ondas.

**Resposta:**
```json
{
  "cameras": [
    {
      "IDPontoVisualizacao": "string",
      "IDCamera": "string",
      "VersaoFirmware": "string | null",
      "Latitude": -23.5,
      "Longitude": -46.6,
      "distanceKm": 12.4
    }
  ],
  "plan": {
    "totalCameras": 300,
    "centerLat": -23.5641718,
    "centerLng": -46.6828659,
    "alpha": 0.25,
    "daysPerWave": 2,
    "totalWaves": 7,
    "totalDays": 14,
    "waves": [
      {
        "wave": 1,
        "day": 2,
        "radiusKm": 5.3,
        "camerasInWave": 18,
        "cumulativeCameras": 18,
        "fraction": 0.06,
        "percentageCoverage": 6.0
      }
    ]
  }
}
```

---

## Algoritmo de Wave Planner

### 1. Cálculo de distância (Haversine)

Para cada câmera, calcula a distância geodésica ao ponto de origem:

```
a = sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlng/2)
d = R · 2 · atan2(√a, √(1−a))    (R = 6371 km)
```

### 2. Distribuição exponencial por ondas

Cada onda `k` cobre uma fração acumulada das câmeras (ordenadas por distância):

```
frac(k) = (e^(α·k) − 1) / (e^(α·N) − 1)
```

Onde:
- `k` = número da onda (1 a N)
- `N` = total de ondas
- `α` = parâmetro de aggressividade (`0.25` → crescimento moderado)

**Efeito do `alpha`:**
- Valor baixo → distribuição quase linear entre as ondas
- Valor alto → poucas câmeras nas primeiras ondas, grande concentração nas finais

### 3. Raio de cada onda

O raio de cobertura da onda `k` corresponde à distância empírica da câmera no índice `floor(frac(k) × total)`, representando o alcance máximo daquela onda.

---

## Dashboard

A interface web exibe:

- **Mapa Leaflet** com tema escuro (CartoDB Dark)
- **Marcador de origem** (HQ) em amarelo
- **Marcadores de câmeras** coloridos por onda de deployment
- **Círculos concêntricos** representando o raio de cada onda
- **Contornos geográficos** de estados (SP, RJ, MG) e municípios via GeoJSON

**Painel lateral:**
- Botão de refresh para acionar o pipeline
- Estatísticas gerais: total de câmeras, ondas, duração, alpha
- Tabela com breakdown por onda: dia, raio (km), câmeras na onda, cobertura acumulada (%)

---

## Configuração e Execução

**Pré-requisitos:** Node.js 20+, npm

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (com hot reload)
npm run start:dev

# Compilar para produção
npm run build

# Executar build
npm start
```

A aplicação sobe na porta `3000` por padrão. Para usar outra porta:

```bash
PORT=4000 npm run start:dev
```

Dashboard disponível em: `http://localhost:3000/dashboard`

---

## Scripts

| Script                  | Descrição                                          |
|-------------------------|----------------------------------------------------|
| `npm start`             | Inicia a aplicação                                 |
| `npm run start:dev`     | Modo watch (reinicia ao salvar)                    |
| `npm run start:debug`   | Modo debug com watch                               |
| `npm run build`         | Compila TypeScript                                 |
| `npm run lint`          | Verifica estilo com ESLint                         |
| `npm test`              | Executa testes com Jest                            |
| `npm run test:watch`    | Testes em modo watch                               |
| `npm run test:cov`      | Relatório de cobertura de testes                   |

> Todos os scripts de start executam `scripts/free-port.js` antes de iniciar, liberando a porta alvo caso já esteja em uso.

---

## Status de Implementação

| Módulo              | Status              | Descrição                                        |
|---------------------|---------------------|--------------------------------------------------|
| `dashboard`         | Implementado        | UI + endpoints REST funcionais                   |
| `api-grafana`       | Implementado        | Dados estáticos; repositório pronto para HTTP    |
| `pipeline`          | Implementado        | Orquestração completa                            |
| `wave-planner`      | Implementado        | Algoritmo Haversine + distribuição exponencial   |
| `api-camera`        | Stub                | Interface definida; chamadas não implementadas   |
| `api-tunnels`       | Stub                | Módulo vazio                                     |
| `api-bifrost`       | Stub                | Módulo vazio                                     |
| `camera-discovery`  | Stub                | Módulo vazio                                     |
| `firmware-updater`  | Stub                | Módulo vazio                                     |
| Persistência (DB)   | Stub                | Repositórios com métodos placeholder             |
