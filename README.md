# savepoint

## Prerequisites

- [Volta](https://docs.volta.sh/guide/getting-started)：JavaScriptのツールマネージャー
  - [pnpmを利用するため、環境変数に `VOLTA_FEATURE_PNPM=1` を設定しておく。](https://docs.volta.sh/advanced/pnpm)

## Getting Started

### Build a Enviroment

```shell
cd savepoint
pnpm install
```

## Getting Started

1. `.env.sample` をコピーして `.env` を作成し、環境変数を設定する。

```shell
cp .env.sample .env
```

2. セットアップを完了し、アプリケーションを立ち上げる。

```shell
cd savepoint
pnpm install
pnpx prisma generate  # Prismaのセットアップ
pnpm build
pnpm start
```

3. [http://localhost:3000](http://localhost:3000) にアクセスする。

## For Developers


### Best Efforts

#### データフロー

- loader → component → actionの流れに従う。
- データの取得はloaderで行う。
- データの送信はFormとactionで行う。
  - 基本的に、useStateによるフォーム値の管理は必要ない。
  - 基本的に、useEffectによる副作用でデータを更新するのではなく、Formのpostでデータを更新する。

#### レンダリング

- 基本的にはサーバーでSSRを採用する。
  - "use client"はなるべく使用しない。
  - "use client"を使用する場合は、コンポーネントの責務をUIに切り分けてから使用する。
  - ロジックを担当するコンポーネントはサーバーでレンダリングする。
  - client componentの下にserver componentは配置できない。

#### ルーティング/ディレクトリ構成

- ディレクトリ方式を採用する。
- colocationを意識する。
- ファイル名はケバブケースで表記する。

#### その他

- Voltaを推奨：Nodeとパッケージマネージャのバージョン管理/統一がしやすい。
- linter/formatterはbiomejsを使用する。

## References

- [Remix](https://remix.run/)
- [Three.js](https://threejs.org/docs/#manual/en/introduction/Installation)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Auth.js](https://authjs.dev/getting-started)
- [Prisma](https://www.prisma.io/docs/getting-started)
- [Volta](https://docs.volta.sh/guide/getting-started)
- [pnpm](https://pnpm.io/ja/)
- [Supabase](https://supabase.com/docs/guides/database/overview)
