/* config.js — Татарнетес UI көйләмәсе / optional Tatarnetes UI configuration.
   Буш калса — ДЕМО режим. ?api= URL параметры моннан өстен.
   Leave empty for DEMO mode. The ?api= URL parameter overrides this file.

   api: kubectl proxy API адресы — бары шул ук чыганак (same-origin).
        The API base served by kubectl proxy; it must be same-origin, e.g. "/"
        when the UI itself is served by `kubectl proxy --www=. --www-prefix=/ui/`.
   namespace: бер мәйдан гына күрсәтү өчен / show a single namespace (optional). */
window.TATARNETES_UI_CONFIG = window.TATARNETES_UI_CONFIG || {
  // api: "/",
  // namespace: "gadati",
};
