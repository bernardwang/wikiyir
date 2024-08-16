<template>
  <div class="donate-container wrapper">
    <div class="donate-content">
      <h1>Donate today.</h1>
      <p>
        Wikipedia relies on the support of people like you to keep free knowledge accessible to
        everyone. As an encyclopedia written entirely by volunteers, Wikipedia is crucial for
        preserving and sharing humanity's collective knowledge. Without it, our ability to leave an
        unbiased record of our collective history would be severely compromised. By donating, you
        help ensure that Wikipedia remains a vital resource for the world, keeping the world's
        knowledge available to all, and expanding it for future generations.
      </p>
      <cdx-button class="donate-btn" action="progressive" weight="primary">
        <cdx-icon :icon="cdxIconHeart" />
        Donate
      </cdx-button>
    </div>
    <div class="logo">
      <img src="@/assets/puzzleGlobe.svg" alt="Wikipedia" />
    </div>
  </div>
</template>

<script setup>
import { CdxButton, CdxIcon } from '@wikimedia/codex'
import { cdxIconHeart } from '@wikimedia/codex-icons'
</script>

<style scoped>
.donate-container {
  display: flex;
  padding: 2rem;
  border-radius: 8px;
}

.donate-content {
  flex: 1;
  padding-right: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.donate-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.heart-icon {
  margin-right: 0.5rem;
}

.logo {
  flex: 0 0 50%;
  display: flex;
  justify-content: flex-start;
  filter: invert(10%) sepia(84%) saturate(4680%) hue-rotate(355deg) brightness(87%) contrast(113%);
  img {
    margin-left: -30%;
  }
}
</style>
