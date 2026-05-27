# Bulletin Board

誰でも自由に話題を投稿し、コメントを通して交流できる掲示板アプリです。

メール認証を使ってログインし、スレッドの作成、一覧表示、コメント投稿、コメント削除までを行えます。  
シンプルな操作性を重視しながら、気軽に会話を始められるコミュニティを目指しています。

このプロジェクトはVercelでホストされており、以下のURLでアクセスできます。<br/>
https://bulletin-board-rosy-xi.vercel.app/

## 主な機能

- メール認証によるログイン
- 新規会員登録
- スレッド一覧の閲覧
- スレッドの作成
- スレッド詳細の閲覧
- コメント投稿
- 自分のコメント削除
- About ページの表示

## 使用技術

- Next.js
- TypeScript
- Supabase
  - Authentication
  - Database
- React Hook Form
- Vitest
- React Testing Library
- ESLint
- Tailwind CSS
- GitHub Actions（CI/CD）

## ディレクトリ構成

```text
.
├─ app/
│  ├─ (auth)/
│  │  ├─ about/
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  └─ threads/
│  │     ├─ [id]/
│  │     │  ├─ CommentForm.tsx
│  │     │  ├─ deleteComment.ts
│  │     │  └─ page.tsx
│  │     ├─ new/
│  │     │  └─ page.tsx
│  │     └─ page.tsx
│  ├─ (guest)/
│  │  ├─ layout.tsx
│  │  ├─ login/
│  │  │  └─ page.tsx
│  │  └─ signup/
│  │     └─ page.tsx
│  ├─ api/
│  │  ├─ threads/
│  │  │  ├─ new/
│  │  │  │  └─ route.ts
│  │  │  └─ route.ts
│  │  └─ users/
│  │     └─ [user_id]/
│  │        └─ route.ts
│  ├─ globals.css
│  └─ layout.tsx
├─ components/
│  └─ Header.tsx
├─ contexts/
│  └─ AuthContext.ts
├─ hooks/
│  └─ useAuth.ts
├─ providers/
│  └─ AuthProvider.tsx
├─ public/
├─ supabase/
├─ types/
│  ├─ threads.ts
│  └─ user.ts
└─ utils/
   ├─ supabase/
   │  ├─ client.ts
   │  └─ server.ts
   └─ supabaseFunctions.tsx
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/Seripro/bulletin-board.git
cd bulletin-board
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

プロジェクト直下に `.env` を作成し、Supabase の URL と公開キーを設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## 起動方法

### 開発サーバーを起動

```bash
npm run dev
```

アプリは、http://localhost:3000 で起動します。

### ビルド

```bash
npm run build
```

### 本番起動

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### テスト

```bash
npm run test
```

## 画面一覧

| URL          | 内容                       |
| ------------ | -------------------------- |
| /login       | ログイン画面               |
| /signup      | 新規登録画面               |
| /about       | アプリ説明                 |
| /threads     | スレッド一覧               |
| /threads/new | スレッド作成               |
| /threads/:id | スレッド詳細・コメント一覧 |

## Supabase テーブル構成

このアプリでは主に次のテーブルを利用します。

### threads テーブル

| カラム名   | 型     | 説明             |
| ---------- | ------ | ---------------- |
| content    | string | スレッド本文     |
| created_at | string | 作成日時         |
| id         | string | 主キー           |
| title      | string | スレッドタイトル |
| updated_at | string | 更新日時         |
| user_id    | string | ユーザーID       |

### comments テーブル

| カラム名   | 型     | 説明                       |
| ---------- | ------ | -------------------------- |
| content    | string | コメント内容               |
| created_at | string | 作成日時                   |
| id         | string | 主キー                     |
| thread_id  | string | threads テーブルの外部キー |
| user_id    | string | ユーザーID                 |

### profiles テーブル

| カラム名   | 型             | 説明            |
| ---------- | -------------- | --------------- |
| avatar_url | string \| null | アバター画像URL |
| created_at | string         | 作成日時        |
| id         | string         | 主キー          |
| name       | string \| null | 表示名          |

## レンダリング戦略

このアプリでは、SEOと初回表示速度の観点から内容を表示するページは SSR を基本とし、入力や認証のようにユーザー操作が中心のページは CSR を使い分けています。
また、認証状態に応じた遷移制御はレイアウトとルートページで行っています。

| ページ          | 方式 | 理由                                                                   |
| --------------- | ---- | ---------------------------------------------------------------------- |
| `/about`        | SSG  | 内容が固定で、毎回サーバーで再計算する必要がないため                   |
| `/threads`      | SSR  | スレッド一覧をサーバー側で取得し、最新の内容を表示するため             |
| `/threads/[id]` | SSR  | コメントを含むスレッド詳細をサーバー側で取得し、最新状態を表示するため |
| `/threads/new`  | CSR  | フォーム入力と送信処理など、動的なユーザー操作が中心のため             |
| `/login`        | CSR  | 認証フォームの入力・送信処理が必要なため                               |
| `/signup`       | CSR  | 新規登録フォームの入力・送信処理が必要なため                           |
