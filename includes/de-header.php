<?php /* Usage: $DE_SITE = 'Shop'; $DE_NAV = [['Home','/'],['Products','/products/']]; include __DIR__.'/de-brand/includes/de-header.php'; */
$__s = htmlspecialchars($DE_SITE ?? '', ENT_QUOTES); $__nav = $DE_NAV ?? []; ?>
<a class="de-skip" href="#main">Skip to content</a>
<header class="de-header" role="banner"><div class="de-wrap"><div class="de-header-in">
  <a class="de-brand" href="/" aria-label="Digital Envisioned<?= $__s ? ' — '.$__s : '' ?> home"><span class="de-mark" aria-hidden="true">DE</span><span class="de-wordmark">Digital Envisioned</span><?php if($__s): ?><span class="de-sitename"><?= $__s ?></span><?php endif; ?></a>
  <?php if($__nav): ?><nav class="de-nav" aria-label="Main"><?php foreach($__nav as $l): ?><a href="<?= htmlspecialchars($l[1],ENT_QUOTES) ?>"><?= htmlspecialchars($l[0]) ?></a><?php endforeach; ?></nav><?php endif; ?>
</div></div></header>
