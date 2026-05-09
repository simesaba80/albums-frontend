# Issue #5: Photo Order Plan

## Goal

写真追加時にユーザーが写真の順序を決められる UI を提供し、保存時に `album[photos_attributes][n][display_order]` として送信する。

Issue 本文では `photo_attributes` と書かれているが、現行コードは Rails nested attributes のキーとして `photos_attributes` を使っているため、既存実装に合わせて `photos_attributes` を維持する。

## UI Policy

写真の並び順は、数値入力ではなく画面上のリスト順で決める。

- 写真行には `#1`, `#2` のような現在位置を表示する。
- 各写真行には上へ移動、下へ移動、削除の操作を置く。
- 上下移動にはアイコンボタンを使う。
- `display_order` の手入力欄は使わない。
- 送信時に、削除対象ではない写真だけを上から順に `0, 1, 2...` と採番する。

初期実装ではドラッグ&ドロップは採用しない。既存依存に並び替え用ライブラリがなく、モバイルとアクセシビリティの検証範囲が増えるため。上下ボタンで明確に順序を決められる UI を先に実装する。

## New Album Page

対象: `src/app/albums/new/page.tsx`

- `photoFiles` の配列順を表示順として扱う。
- 写真追加時は末尾に追加する。
- 上下移動ボタンで `photoFiles` の要素を入れ替える。
- 表示上の index から `#1`, `#2` を表示する。
- FormData 作成時は現在の配列順で `display_order` を `0` 始まりで送る。
- 既存の caption 入力と remove 操作は維持する。

## Edit Album Page

対象: `src/app/albums/[id]/edit/page.tsx`

- 既存写真と新規写真を同じ並び替え対象として扱う。
- 読み込み時は既存写真を `display_order` 昇順に並べる。
- 新規写真は `Add row` ボタンではなく、ファイル選択時に末尾へ追加する。
- 既存写真も新規写真も上下移動できる。
- 既存写真の削除予定は保持し、UI では薄く表示する。
- 削除予定の既存写真は `id` と `_destroy` を送る。
- 削除予定ではない写真だけを上から順に採番して `display_order` を送る。
- 既存の caption 編集、画像差し替え、新規画像選択は維持する。

## Album Show Page

対象: `src/app/albums/[id]/page.tsx`

- 表示時は `display_order` で sort してから `PhotoCard` に渡す。
- API が順序付きで返す場合でも、フロント側で表示順を安定させる。

## Styling

対象: `src/app/globals.css`

- 写真行、順序表示、操作ボタン、ファイル名表示のクラスを追加する。
- モバイルでは写真行が縦に並び、操作ボタンが折り返しても崩れないようにする。
- 既存の `surface-card`, `stack-m`, `caption` などのローカルスタイルを活かす。

## Validation

- `pnpm lint`
- `pnpm build`

手動確認観点:

- 新規作成で複数写真を追加し、上下移動後の順序で送信できる。
- 編集画面で既存写真を並び替えできる。
- 編集画面で新規写真を既存写真の間に移動できる。
- 削除予定の写真は採番対象から外れる。
