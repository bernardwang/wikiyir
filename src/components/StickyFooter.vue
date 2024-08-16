<template>
  <footer class="sticky-footer">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Wikipedia" />
    </div>
    <div class="buttons">
      <cdx-button class="share-btn">
        <cdx-icon :icon="cdxIconShare" />
        Share
      </cdx-button>
      <cdx-button class="donate-btn">
        <cdx-icon :icon="cdxIconHeart" />
        Donate
      </cdx-button>
    </div>
  </footer>
</template>

<script setup>
import { CdxButton, CdxIcon } from '@wikimedia/codex'
import { cdxIconShare, cdxIconHeart } from '@wikimedia/codex-icons'
</script>

<style scoped>
.sticky-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo img {
  width: auto;
  height: 24px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.share-btn, .donate-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.share-btn {
  background-color: #f8f9fa;
  color: #202122;
}

.donate-btn {
  background-color: #3366cc;
  color: white;
}
</style>