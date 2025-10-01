# Funcionalidades da demo

## 1. Modo offline

### Angular PWA

O PWA permite rodar a aplicação mesmo sem internet. O Service Worker armazena assets (HTML, JS, CSS, imagens) e o IndexedDB guarda dados (como usuários, pedidos etc.). Isso garante que o usuário continue usando o app no modo offline e sincronize depois.
Impacto: melhora a experiência do usuário em locais com internet instável, aumenta engajamento.

### Angular SPA

Não possui suporte nativo ao modo offline, só funciona se houver conexão. Até é possível armazenar no localStorage ou IndexedDB, mas o app não roda sem internet, pois os assets precisam vir do servidor.

✅ Vantagem SPA: implementação mais simples.

❌ Desvantagem SPA: quebra total em offline.

🔒 Impossível aplicar totalmente.

## 2. Background Sync

### Angular PWA

Permite que requisições feitas offline (ex: cadastro de usuário, envio de pedido) sejam armazenadas e reenviadas automaticamente quando a conexão voltar.
Impacto: evita perda de dados e frustração do usuário.

### Angular SPA

Não tem suporte nativo. É possível implementar manualmente salvando no IndexedDB e criando mecanismos de retry, mas sem garantia de execução em segundo plano.

✅ Vantagem SPA: total controle do retry no app.

❌ Desvantagem SPA: mais frágil, exige que a aba esteja aberta.

🔒 Possível aplicar parcialmente.

## 3. Autorecuperação

É a capacidade da aplicação se recuperar sozinha de falhas comuns sem precisar que o usuário faça nada.

Exemplos:

- IndexedDB corrompido → resetar e repopular automaticamente.

- Service Worker quebrado → desregistrar e registrar novamente.

- Cache antigo → limpar e baixar a versão nova.

- Request falhada por perda de rede → retry automático.

### Angular PWA

O Service Worker é o grande aliado aqui:

- Consegue detectar inconsistências entre versão em cache e versão remota.

- Pode limpar caches corrompidos e baixar tudo de novo.

- Junto com o Background Sync, garante que operações não se percam.

- O app pode ter um Recovery Service que dispara estratégias de correção sem pedir ação do usuário.

Impacto: o usuário praticamente nunca vê a aplicação “quebrada”. Mesmo que algo dê errado, na próxima inicialização o app se corrige.

### Angular SPA

A autorecuperação é bem mais limitada:

- Se o cache do navegador ficar corrompido, só limpando manualmente.

- Se uma request falhar, precisa implementar retry na aplicação.

- Se um bug de JS parar o app, não há mecanismo automático de reset.

Impacto: o usuário pode ficar preso em um estado inconsistente (por exemplo, SPA quebrada até limpar cache do navegador).

## 4. Atualização automática

### Angular PWA

O Service Worker controla cache de versões. Assim, mesmo que o usuário abra o app sem internet, ele pega a versão salva. Quando online, o SW baixa a versão mais recente em segundo plano e atualiza na próxima execução.
Impacto: entrega estabilidade sem abrir mão de atualizações rápidas.

### Angular SPA

O usuário depende do refresh manual do navegador para carregar uma versão nova. Se o cache do navegador for agressivo, pode ficar preso em versões antigas.

✅ Vantagem SPA: menos complexidade de build/deploy.

❌ Desvantagem SPA: maior risco de inconsistência de versões.

🔒 Possível aplicar parcialmente com configurações de cache HTTP, mas sem o mesmo controle granular.

## 5. Conexão com fila para push notifications (RabbitMQ)

### Angular PWA

Usa Service Workers para receber notificações mesmo com o app fechado, direto no dispositivo. Permite campanhas, alertas de sistema, lembretes etc.
Impacto: aproxima a experiência de um app nativo, aumentando retenção.

### Angular SPA

Não consegue receber notificações em background, apenas se o navegador estiver aberto e a aba ativa.

✅ Vantagem SPA: mais simples, sem configuração extra.

❌ Desvantagem SPA: notificações não são persistentes.

🔒 Impossível aplicar no mesmo nível.

## 6. Funcionamento via aplicativo (Add to Home Screen)

### Angular PWA

Usuários podem instalar o app no celular ou desktop como se fosse um app nativo, com ícone próprio, splash screen e execução em janela standalone.
Impacto: aumenta engajamento, reduz atrito de acesso via navegador.

### Angular SPA

Só pode ser acessado via URL no navegador. Não existe opção nativa de instalação.

✅ Vantagem SPA: zero configuração.

❌ Desvantagem SPA: não cria a sensação de “app de verdade”.

🔒 Impossível aplicar.

## 7. Performance via Cache Estratégico

### Angular PWA

O Service Worker permite estratégias como cache-first, network-first, stale-while-revalidate. Isso garante carregamento imediato dos assets, mesmo com rede lenta.
Impacto: apps PWAs parecem mais rápidos que SPAs tradicionais, mesmo em conexões ruins.

### Angular SPA

Depende exclusivamente do cache HTTP do navegador e CDN. Não há controle granular sobre como servir recursos.

✅ Vantagem SPA: configuração simples com cache HTTP/CDN.

❌ Desvantagem SPA: não é otimizado para offline nem para baixa latência.

🔒 Possível aplicar parcialmente via CDN, mas sem a mesma flexibilidade.

## 8. Tema claro e escuro

### Angular PWA

Com Service Worker e IndexedDB/localStorage, dá pra:

- Guardar a preferência do usuário (claro/escuro).

- Aplicar o tema mesmo offline na inicialização.

- Sincronizar entre dispositivos se o backend permitir (user settings).

- Além disso, é possível usar a API de prefers-color-scheme do navegador, detectando automaticamente se o sistema está em dark mode.

Impacto:

- Experiência consistente mesmo sem internet.

- App instalado no celular (Add to Home Screen) respeita o tema do sistema operacional, como se fosse um app nativo.

### Angular SPA

Também é possível trocar temas dinamicamente via CSS ou Angular Material Theming. Mas:

- A preferência pode ser salva só em localStorage/sessionStorage.

- Se o usuário abrir em outro dispositivo ou limpar cache, perde o tema escolhido.

- Não há integração com "instalação no dispositivo", logo o tema não tem o mesmo peso de experiência nativa.

Impacto:

- Funciona bem para apps sempre online.

- Menos confiável em cenários offline ou cross-device.

## 9. Estrutura com Clean Architecture (**_tsyringe_** - semelhante a **_koin ou get_it_**)

### 1️⃣ Clean Architecture no Angular

Na prática, Clean Architecture separa o app em camadas:

1. **Domain**

   - Entidades, regras de negócio puras.
   - Ex.: `User`, `Order`, `UseCase`.

2. **Use Cases / Application**

   - Casos de uso, lógica de orquestração.
   - Ex.: `GetUserUseCase`, `CreateOrderUseCase`.

3. **Infrastructure / Data**

   - Repositórios, serviços de API, armazenamento local.
   - Ex.: `UserRepositoryImpl` usando HttpClient ou IndexedDB.

4. **Presentation**

   - Componentes Angular, serviços de UI, stores.

No Angular, isso pode ser mapeado assim:

```
src/
 ├─ domain/
 │   ├─ entities/
 │   └─ repositories/
 ├─ application/
 │   └─ use-cases/
 ├─ infrastructure/
 │   ├─ api/
 │   └─ repositories/
 └─ presentation/
     ├─ components/
     └─ services/
```

---

### 2️⃣ Bibliotecas de Injeção de Dependência no Angular

Angular já tem **DI nativo**, mas se você quer algo mais parecido com **Koin/get_it**, existem algumas alternativas:

1. **[tsyringe](https://github.com/microsoft/tsyringe)** (Microsoft)

   - Usa decorators como `@injectable()` e `@inject()`.
   - Fica mais parecido com DI “manual” de outras linguagens.
   - Bom pra Clean Architecture porque você pode resolver dependências de forma explícita, sem amarrar no Angular Module.

2. **[inversify](https://inversify.io/)**

   - Bastante popular para Node e frontend.
   - Suporta `@injectable()` e `@inject(TOKEN)`.
   - Perfeito para projetos que querem desacoplar o Angular DI do core da aplicação.

3. **[brandi](https://github.com/brandi-js/brandi)**

   - DI mais minimalista e moderna.
   - Tipada, simples de usar.
   - Funciona muito bem em projetos Angular 20+ standalone.

---

### 3️⃣ Estrutura de implementação com tsyringe

#### 1️⃣ **`domain/`** — o núcleo puro da aplicação

##### Objetivo:

- Contém **a lógica central e regras de negócio**, totalmente **independente de frameworks, Angular, HTTP ou DB**.
- Nada aqui sabe sobre Angular, IndexedDB, HTTP, ou PWA. Só regras.

##### Estrutura típica:

```
domain/
 ├─ entities/
 │   └─ user.ts
 ├─ repositories/
 │   └─ user-repository.ts
 └─ usecases? (às vezes, mas melhor na camada application)
```

##### Conteúdo:

###### **Entities**

- Representam os objetos do negócio (ex: `User`, `Order`, `Invoice`).
- Contêm apenas dados + pequenas regras de validação (não falham em infraestrutura).

```ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```

###### **Repositories (interfaces)**

- Definem **contratos abstratos** que a camada application pode usar.
- Não implementam nada, só métodos esperados.

```ts
export interface UserRepository {
  fetchUsers(): Promise<User[]>;
  getCachedUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
}
```

---

#### 2️⃣ **`application/`** — casos de uso

##### Objetivo:

- Contém **os casos de uso** da aplicação (o “o que o sistema faz”), cada um como uma classe ou service.
- Essa camada depende **somente do domain**, nunca de Angular diretamente.
- Aqui que entra o **TSyringe** para injetar os repositories.

##### Estrutura típica:

```
application/
 └─ use-cases/
     ├─ fetch-users.usecase.ts
     ├─ get-cached-users.usecase.ts
     └─ delete-user.usecase.ts
```

##### Conteúdo:

```ts
@Injectable()
export class FetchUsersUseCase {
  constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}

  execute(): Promise<User[]> {
    return this.repo.fetchUsers();
  }
}
```

- Cada use-case representa **uma ação concreta do sistema**.
- Recebe os **repositories via injeção de dependência** (`TSyringe` ou Angular `@Inject`).

---

#### 3️⃣ **`infrastructure/`** — implementações externas

##### Objetivo:

- Implementa os **contratos do domain**, ou seja, as classes concretas que acessam **HTTP, IndexedDB, APIs externas, Firebase, etc**.
- Essa camada depende de **domain**, mas domain nunca depende dela.

##### Estrutura típica:

```
infrastructure/
 └─ repositories/
     └─ user-repository-impl.ts
```

##### Conteúdo:

```ts
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private http: HttpClient, private dbOffline: DbOfflineService) {}

  async fetchUsers(): Promise<User[]> {
    // busca do backend e salva no IndexedDB
  }

  async getCachedUsers(): Promise<User[]> {
    return this.dbOffline.getAll<User>('users');
  }
}
```

- Aqui você liga **o contrato da domain** (`UserRepository`) com **uma implementação concreta** (HTTP + IndexedDB).
- É nessa camada que Angular, `HttpClient`, IndexedDB e outros serviços entram.

---

#### 4️⃣ **`presentation/`** — UI e serviços de interface

##### Objetivo:

- Contém **componentes, páginas, dialogs, serviços de UI**.
- Depende de **application** (para chamar os use-cases) e às vezes de `domain` (tipos de entidades).
- Nunca deve conter lógica de negócio complexa ou acesso direto a backend.

##### Estrutura típica:

```
presentation/
 ├─ components/
 │   ├─ user-form-dialog.component.ts
 │   └─ offline.component.ts
 └─ services/
     ├─ offline-db.service.ts
     ├─ theme.service.ts
     └─ notification.service.ts
```

##### Conteúdo:

- **Components** → Angular standalone components, apenas interface com o usuário.
- **Services** → auxiliares da UI (tema, notificações, fila de offline) mas não fazem lógica de negócio direta.
- **Exemplo**: chamar `FetchUsersUseCase.execute()` e popular o template.

```ts
async loadUsers() {
  this.users = await this.fetchUsersUseCase.execute();
}
```

---

#### 5️⃣ **`inject-tokens.ts`** — ponte para DI

##### Objetivo:

- Criar **tokens de injeção** para injetar **interfaces/abstrações** no Angular ou TSyringe.
- Angular não consegue injetar **interfaces ou tipos abstratos**, então usamos `InjectionToken`.

##### Exemplo:

```ts
import { InjectionToken } from '@angular/core';
import { UserRepository } from './domain/repositories/user-repository';

export const USER_REPOSITORY = new InjectionToken<UserRepository>('UserRepository');
```

- Agora no `main.ts` ou nos use-cases:

```ts
{ provide: USER_REPOSITORY, useClass: UserRepositoryImpl }
```

- Use-cases recebem a **implementação correta** sem depender de Angular ou HTTP diretamente.

---

##### 🔹 Resumindo dependências entre camadas

```
presentation -> application -> domain
infrastructure -> domain
```

- **domain**: não depende de ninguém
- **application**: depende de domain (entidades + interfaces)
- **infrastructure**: depende de domain (implementa interfaces)
- **presentation**: depende de application + domain (apenas tipos)
- **inject-tokens**: permite Angular ou TSyringe fornecer implementações concretas aos casos de uso

---

# Como executar a aplicação

### Executando o App (WEB)

#### 1. Execute o comando **_npm install_**

#### 2. Execute o comando **_npm run preview_** para modo produção ou **_npm run start_** para modo desenvolvimento

### Executando a API (SERVER)

#### 1. Execute o comando **_npm install_**

#### 2. Para rodar o server -> **_docker compose up --build rabbitmq_** e **_docker compose up --build server_**

# IndexedDB

O IndexedDB é o banco de dados nativo do navegador, pensado exatamente para apps web complexos, PWAs e cenários offline. Bora destrinchar os pontos importantes:

## 1. Limite de armazenamento

Varia por navegador e dispositivo → não existe um limite fixo, mas sim proporcional ao espaço em disco disponível.

Em geral:

- Chrome/Edge/Opera → até 60% do espaço livre em disco pode ser usado.

- Firefox → cerca de 10% do espaço livre em disco.

- Safari (iOS/macOS) → mais restritivo, em torno de 50MB por app antes de pedir permissão ao usuário.

- Arquivos grandes são possíveis: IndexedDB suporta armazenar BLOBs (imagens, vídeos, PDFs etc.), diferente do localStorage que só aceita strings.

👉 Ou seja: na prática você pode guardar centenas de MB ou até GBs em desktops, mas em mobile (especialmente iOS) é mais limitado.

## 2. Persistência

Em desktop, os dados geralmente ficam persistentes até o usuário limpar manualmente o cache.

Em dispositivos móveis, se o sistema operacional estiver com pouco espaço, o IndexedDB pode ser limpo automaticamente (evicted).

Chrome e Edge suportam a API de Persistent Storage (mediante permissão do usuário), garantindo que o navegador não limpe seus dados.

## 📌 Vantagens do IndexedDB

- Armazena muito mais que o localStorage

- localStorage → limite de ~5MB.

- IndexedDB → dezenas ou centenas de MB.

- Estrutura de banco NoSQL

- Permite object stores (tipo tabelas).

- Indexação por chaves → buscas rápidas.

- Suporta objetos complexos (não só texto).

- Suporte a operações assíncronas

- Não trava a thread principal como o localStorage.

- Perfeito para apps grandes sem engasgos de UI.

- Funciona offline

- Essencial para PWAs → permite ler/escrever dados sem rede.

- Exemplo: Gmail offline, Trello PWA.

- Integração com sincronização posterior

- Dá pra guardar filas de requisições offline e, quando voltar internet, reenviar (exemplo: cadastros, pedidos, mensagens).

- Suporte a blobs

- Ideal para guardar imagens, vídeos, áudios e arquivos sem depender de servidor imediato.

## 📌 Desvantagens do IndexedDB

- API verbosa e complexa → muitos usam wrappers (Dexie.js, LocalForage, NgRx Data).

- Compatibilidade entre navegadores → alguns (principalmente Safari/iOS) ainda têm limitações.

- Não é relacional → não tem joins ou SQL, só consultas por chave/índice.

- Possível limpeza automática em dispositivos móveis se o SO precisar liberar espaço.

## 🔎 Resumindo

- Limite: varia por navegador/dispositivo →

- Desktop: até GBs.

- Mobile (iOS): em torno de 50MB sem permissão.

### Vantagens:

- Muito mais espaço que localStorage.

- Suporta objetos complexos e blobs.

- Offline-first + sincronização posterior.

- Performance assíncrona.

- Ideal para Angular PWA que precisa de cache de dados offline, enquanto no SPA tradicional muitas vezes só se usa localStorage/sessionStorage por simplicidade.
