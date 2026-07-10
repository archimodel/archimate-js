# project_spec

- `archimate-js` に ArchiMate 4.0 対応を追加する。
- 既存 ArchiMate 3.x import/export/modeling を壊さない。
- C260/W262、Appendix B の個人利用範囲、ArchiMate 4 Model Exchange File Format XSD の入手状況は `docs/archimate4/sources.md` に記録する。
- W262 の変更理由は機械可読カバレッジとして実装・移行・表示機能へ対応付ける。
- Appendix B は個人利用承認と完全な機械可読プロファイルの有無を分離し、C260 の AI/自動処理制限を越えて抽出しない。
- C260/XSD 未確認部分は experimental として明示し、テスト可能な内部 round-trip と migration behavior を優先する。
