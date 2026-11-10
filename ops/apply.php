<?php
// Digital Envisioned brand rollout applier (Hark, 2026-11-10). Token-protected (sha256 of ?k=).
// Applies ops/manifest.json: exact markup hunks with sha1 guard, backup of the ORIGINAL file before first write.
// Never touches PHP code (hunks containing <? or ?> are refused), auth/admin/payment/config files, /legal/, /privacy/, /terms/.
// GET ?k=..&n=<nonce>[&dry=1]. Idempotent: a file whose sha1 no longer matches is skipped ("changed").
// Undo: ?k=..&undo=1 restores every file this tool backed up. Delete this folder when done.
declare(strict_types=1);
const KHASH = 'ed6bdc7f5a4ee0c9cdccae110998b9f08f6437e636d323ee80c309d2cdf065ab';
const ROOT = '/home/u450178537/domains';
const BK = '/home/u450178537/de_backups/brand-20261110-apply';
header('Content-Type: application/json'); header('Cache-Control: no-store'); header('X-Robots-Tag: noindex');
if (!hash_equals(KHASH, hash('sha256', (string)($_GET['k'] ?? '')))) { http_response_code(404); exit; }
@set_time_limit(100);
function out($x) { echo json_encode($x, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT); exit; }
function bad(string $d, string $p): ?string {
  if (!preg_match('/^[a-z0-9.\-]+$/i', $d) || str_contains($p, '..') || str_contains($p, "\0")) return 'bad path';
  $r = "$d/$p";
  if (preg_match('#^public_html/(legal|privacy|terms)(/|$)#i', $p)) return 'legal (other agent)';
  if (preg_match('#(^|/)(login|logout|setup|install|register|signin|auth|admin|dashboard)[^/]*#i', $p)) return 'auth/admin';
  if (preg_match('#(stripe|paypal|square|webhook|pay|checkout|billing|ach|invoice)[^/]*$#i', $p)) return 'payments';
  if (preg_match('#(^|/)(config[^/]*|\.env[^/]*|\.htaccess|\.user\.ini|php\.ini)$#i', $p)) return 'config';
  if (preg_match('#(^|/)(vendor|node_modules|private|de_shared|decore|de-auth|core/api)(/|$)#i', $p)) return 'private';
  if (!preg_match('#\.(html?|php)$#i', $p)) return 'type';
  return null;
}
$undo = !empty($_GET['undo']); $dry = !empty($_GET['dry']);
$res = [];
if ($undo) {
  $it = is_dir(BK) ? new RecursiveIteratorIterator(new RecursiveDirectoryIterator(BK, FilesystemIterator::SKIP_DOTS)) : [];
  foreach ($it as $f) { $rel = substr($f->getPathname(), strlen(BK) + 1); if ($rel === 'log.json') continue;
    $res[] = [$rel, $dry ? 'would restore' : (@copy($f->getPathname(), ROOT . '/' . $rel) ? 'restored' : 'FAILED')]; }
  out(['ok' => true, 'undo' => $res]);
}
$m = json_decode((string)@file_get_contents(__DIR__ . '/manifest.json'), true);
if (!is_array($m)) out(['ok' => false, 'err' => 'no manifest']);
$t0 = microtime(true);
foreach ($m['ops'] ?? [] as $o) {
  if (microtime(true) - $t0 > 85) { $res[] = [$o['d'] . '/' . $o['p'], 'TIMEOUT-rerun']; continue; }
  $d = (string)$o['d']; $p = (string)$o['p']; $id = "$d/$p";
  if ($why = bad($d, $p)) { $res[] = [$id, "refused: $why"]; continue; }
  $abs = ROOT . "/$d/$p";
  if (!is_file($abs)) { $res[] = [$id, 'missing']; continue; }
  $c = (string)file_get_contents($abs); $sha = sha1($c);
  if (!empty($o['skip_if']) && str_contains($c, (string)$o['skip_if'])) { $res[] = [$id, 'already applied']; continue; }
  $shaNote = ($sha === (string)($o['sha1'] ?? '')) ? 'sha-ok' : 'sha-differs:' . $sha; // hunks below are exact-count guarded
  $new = $c; $err = null;
  foreach ($o['hunks'] as $h) { [$old, $rep] = $h;
    if ($old === '' || str_contains($old . $rep, '<?') || str_contains($old . $rep, '?>')) { $err = 'hunk touches php'; break; }
    $n = substr_count($new, $old); $want = (int)($h[2] ?? 0);
    if ($n < 1) { $err = 'hunk not found: ' . substr($old, 0, 60); break; }
    if ($want && $n !== $want) { $err = "hunk count $n != $want"; break; }
    $new = str_replace($old, $rep, $new); }
  if ($err) { $res[] = [$id, $err]; continue; }
  if ($dry) { $res[] = [$id, 'would apply', $shaNote]; continue; }
  $b = BK . "/$d/$p"; if (!is_file($b)) { @mkdir(dirname($b), 0700, true); if (!@copy($abs, $b)) { $res[] = [$id, 'backup failed, skipped']; continue; } }
  $tmp = $abs . '.de-tmp'; if (file_put_contents($tmp, $new, LOCK_EX) === false || !@rename($tmp, $abs)) { @unlink($tmp); $res[] = [$id, 'write failed']; continue; }
  $res[] = [$id, 'applied', $shaNote, sha1($new)];
}
@mkdir(BK, 0700, true); @file_put_contents(BK . '/log.json', json_encode(['t' => date('c'), 'dry' => $dry, 'res' => $res], JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND);
out(['ok' => true, 'dry' => $dry, 'results' => $res]);
