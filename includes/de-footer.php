<?php /* Usage: $DE_AFFILIATE = true; include __DIR__.'/de-brand/includes/de-footer.php'; */ $__aff = !empty($DE_AFFILIATE); ?>
<footer class="de-footer" role="contentinfo"><div class="de-wrap">
<?php if($__aff): ?><p class="de-disclosure"><strong>Affiliate disclosure:</strong> some links on this site are affiliate links. If you buy through them, Digital Envisioned may earn a commission at no extra cost to you. Results vary; nothing here is a promise of income.</p><?php endif; ?>
  <p class="de-footer-line"><strong>Digital Envisioned</strong> · Founded by Joshua Newton · PO Box 3063, Montgomery, AL 36109 · <a href="tel:+12055788884">205-578-8884</a></p>
  <ul class="de-footer-links"><li><a href="/legal/privacy/">Privacy</a></li><li><a href="/legal/terms/">Terms</a></li><li><a href="/legal/refunds/">Refunds</a></li><?php if($__aff): ?><li><a href="/legal/affiliate-disclosure/">Affiliate disclosure</a></li><?php endif; ?></ul>
  <p class="de-footer-note">© <?= date('Y') ?> Digital Envisioned. All rights reserved.</p>
</div></footer>
