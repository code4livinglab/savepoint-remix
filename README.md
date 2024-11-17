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
pnpx prisma init  # Prismaのセットアップ
pnpm build
pnpm start
```

3. [http://localhost:3000](http://localhost:3000) にアクセスする。


## References

- [Remix](https://remix.run/)
- [Three.js](https://threejs.org/docs/#manual/en/introduction/Installation)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Auth.js](https://authjs.dev/getting-started)
- [Prisma](https://www.prisma.io/docs/getting-started)
- [Volta](https://docs.volta.sh/guide/getting-started)
- [pnpm](https://pnpm.io/ja/)
- [Supabase](https://supabase.com/docs/guides/database/overview)
